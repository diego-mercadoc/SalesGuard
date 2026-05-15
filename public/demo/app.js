const state = {
  token: localStorage.getItem("salesguardToken") || "",
  userId: localStorage.getItem("salesguardUserId") || "",
  email: localStorage.getItem("salesguardEmail") || "",
  datasets: [],
  dailySales: [],
  anomalies: [],
  selectedDataset: null
};

const loginView = document.querySelector("#login-view");
const appView = document.querySelector("#app-view");
const loginMessage = document.querySelector("#login-message");
const appMessage = document.querySelector("#app-message");
const userEmail = document.querySelector("#user-email");
const datasetsList = document.querySelector("#datasets-list");
const datasetForm = document.querySelector("#dataset-form");
const datasetTitle = document.querySelector("#dataset-title");
const datasetDescriptionText = document.querySelector("#dataset-description-text");
const datasetEmpty = document.querySelector("#dataset-empty");
const datasetWorkspace = document.querySelector("#dataset-workspace");
const dailySaleForm = document.querySelector("#daily-sale-form");
const salesList = document.querySelector("#sales-list");
const anomaliesList = document.querySelector("#anomalies-list");
const analysisSummary = document.querySelector("#analysis-summary");
const runAnalysisButton = document.querySelector("#run-analysis");
const refreshDatasetsButton = document.querySelector("#refresh-datasets");
const logoutButton = document.querySelector("#logout-button");

const readLoginParams = () => {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  const userId = params.get("userId");
  const email = params.get("email");
  const errorMessage = params.get("message");

  if (token) {
    state.token = token;
    localStorage.setItem("salesguardToken", token);
  }

  if (userId) {
    state.userId = userId;
    localStorage.setItem("salesguardUserId", userId);
  }

  if (email) {
    state.email = email;
    localStorage.setItem("salesguardEmail", email);
  }

  if (errorMessage) {
    loginMessage.textContent = errorMessage;
    loginMessage.classList.add("error");
  }

  if (token || errorMessage) {
    window.history.replaceState({}, document.title, "/demo/");
  }
};

const showMessage = (message, isError = false) => {
  appMessage.textContent = message;
  appMessage.classList.toggle("error", isError);
};

const formatDate = (value) => {
  if (!value) {
    return "";
  }

  return String(value).slice(0, 10);
};

const escapeHtml = (value) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const apiRequest = async (path, options = {}) => {
  const response = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${state.token}`,
      ...(options.headers || {})
    }
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "No se pudo completar la accion");
  }

  return data;
};

const renderSession = () => {
  const hasToken = Boolean(state.token);
  loginView.classList.toggle("hidden", hasToken);
  appView.classList.toggle("hidden", !hasToken);
  userEmail.textContent = state.email ? `Sesion iniciada como ${state.email}` : "Sesion iniciada";
};

const renderDatasets = () => {
  if (state.datasets.length === 0) {
    datasetsList.innerHTML = '<p class="muted">No hay datasets registrados.</p>';
    return;
  }

  datasetsList.innerHTML = state.datasets
    .map((dataset) => {
      const active = state.selectedDataset?.id === dataset.id ? " active" : "";
      const description = dataset.description || "Sin descripcion";

      return `
        <button class="dataset-item${active}" data-dataset-id="${dataset.id}">
          <strong>${escapeHtml(dataset.name)}</strong>
          <span>${escapeHtml(description)}</span>
        </button>
      `;
    })
    .join("");
};

const renderDatasetDetail = () => {
  const dataset = state.selectedDataset;
  runAnalysisButton.disabled = !dataset;
  datasetEmpty.classList.toggle("hidden", Boolean(dataset));
  datasetWorkspace.classList.toggle("hidden", !dataset);

  if (!dataset) {
    datasetTitle.textContent = "Selecciona un dataset";
    datasetDescriptionText.textContent = "";
    return;
  }

  datasetTitle.textContent = dataset.name;
  datasetDescriptionText.textContent = dataset.description || "Sin descripcion";

  const sales = state.dailySales.filter((sale) => Number(sale.datasetId) === Number(dataset.id));
  salesList.innerHTML = renderSalesTable(sales);

  const anomalies = state.anomalies.filter((item) => Number(item.datasetId) === Number(dataset.id));
  anomaliesList.innerHTML = renderAnomaliesTable(anomalies);
};

const renderSalesTable = (sales) => {
  if (sales.length === 0) {
    return '<p class="muted">Este dataset aun no tiene ventas diarias.</p>';
  }

  return `
    <table>
      <thead>
        <tr>
          <th>Fecha</th>
          <th>Venta diaria</th>
        </tr>
      </thead>
      <tbody>
        ${sales
          .map(
            (sale) => `
              <tr>
                <td>${formatDate(sale.date)}</td>
                <td>${escapeHtml(sale.dailySales)}</td>
              </tr>
            `
          )
          .join("")}
      </tbody>
    </table>
  `;
};

const renderAnomaliesTable = (anomalies) => {
  if (anomalies.length === 0) {
    return '<p class="muted">No hay anomalias registradas para este dataset.</p>';
  }

  return `
    <table>
      <thead>
        <tr>
          <th>Fecha</th>
          <th>Valor</th>
          <th>Score</th>
          <th>Severidad</th>
        </tr>
      </thead>
      <tbody>
        ${anomalies
          .map(
            (anomaly) => `
              <tr>
                <td>${formatDate(anomaly.date)}</td>
                <td>${escapeHtml(anomaly.value)}</td>
                <td>${escapeHtml(anomaly.score)}</td>
                <td>${escapeHtml(anomaly.severity)}</td>
              </tr>
            `
          )
          .join("")}
      </tbody>
    </table>
  `;
};

const loadUser = async () => {
  const data = await apiRequest("/api/auth/me");
  state.userId = String(data.user.id);
  state.email = data.user.email;
  localStorage.setItem("salesguardUserId", state.userId);
  localStorage.setItem("salesguardEmail", state.email);
};

const loadDatasets = async () => {
  const data = await apiRequest("/api/datasets");
  state.datasets = data.datasets || [];
  renderDatasets();
};

const loadDailySales = async () => {
  const data = await apiRequest("/api/daily-sales");
  state.dailySales = data.dailySales || [];
};

const loadAnomalies = async () => {
  const data = await apiRequest("/api/anomalies");
  state.anomalies = data.anomalies || [];
};

const loadDemoData = async () => {
  await Promise.all([loadDatasets(), loadDailySales(), loadAnomalies()]);
  renderDatasetDetail();
};

const selectDataset = async (datasetId) => {
  const data = await apiRequest(`/api/datasets/${datasetId}`);
  state.selectedDataset = data.dataset;
  analysisSummary.textContent = "";
  renderDatasets();
  renderDatasetDetail();
};

datasetForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(datasetForm);

  try {
    if (!state.userId) {
      await loadUser();
    }

    const data = await apiRequest("/api/datasets", {
      method: "POST",
      body: JSON.stringify({
        name: formData.get("name"),
        description: formData.get("description"),
        userId: Number(state.userId)
      })
    });

    datasetForm.reset();
    await loadDatasets();
    await selectDataset(data.dataset.id);
    showMessage("Dataset creado correctamente.");
  } catch (error) {
    showMessage(error.message, true);
  }
});

dailySaleForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!state.selectedDataset) {
    return;
  }

  const formData = new FormData(dailySaleForm);

  try {
    await apiRequest("/api/daily-sales", {
      method: "POST",
      body: JSON.stringify({
        datasetId: String(state.selectedDataset.id),
        date: formData.get("date"),
        dailySales: Number(formData.get("dailySales"))
      })
    });

    dailySaleForm.reset();
    await loadDailySales();
    renderDatasetDetail();
    showMessage("Venta diaria registrada.");
  } catch (error) {
    showMessage(error.message, true);
  }
});

datasetsList.addEventListener("click", async (event) => {
  const datasetButton = event.target.closest("[data-dataset-id]");

  if (!datasetButton) {
    return;
  }

  try {
    await selectDataset(datasetButton.dataset.datasetId);
  } catch (error) {
    showMessage(error.message, true);
  }
});

runAnalysisButton.addEventListener("click", async () => {
  if (!state.selectedDataset) {
    return;
  }

  try {
    const data = await apiRequest(`/api/anomalies/run/${state.selectedDataset.id}`, {
      method: "POST"
    });

    analysisSummary.textContent = `${data.summary.anomaliesDetected} anomalia(s) detectada(s). Promedio: ${data.summary.average}. Desviacion estandar: ${data.summary.standardDeviation}.`;
    await loadAnomalies();
    renderDatasetDetail();
    showMessage("Analisis ejecutado correctamente.");
  } catch (error) {
    showMessage(error.message, true);
  }
});

refreshDatasetsButton.addEventListener("click", async () => {
  try {
    await loadDemoData();
    showMessage("Datos actualizados.");
  } catch (error) {
    showMessage(error.message, true);
  }
});

logoutButton.addEventListener("click", () => {
  localStorage.removeItem("salesguardToken");
  localStorage.removeItem("salesguardUserId");
  localStorage.removeItem("salesguardEmail");
  window.location.href = "/demo/";
});

const start = async () => {
  readLoginParams();
  renderSession();

  if (!state.token) {
    return;
  }

  try {
    await loadUser();
    renderSession();
    await loadDemoData();
  } catch (error) {
    showMessage(error.message, true);
  }
};

start();
