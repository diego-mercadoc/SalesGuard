import { Router } from "express";

import { anomaliesRouter } from "./anomalies.routes";
import { authRouter } from "./auth.routes";
import { dailySalesRouter } from "./daily-sales.routes";
import { datasetsRouter } from "./datasets.routes";
import { getApiOverview } from "../controllers/system.controller";
import { healthRouter } from "./health.routes";
import { usersRouter } from "./users.routes";

export const apiRouter = Router();

apiRouter.get("/", getApiOverview);
apiRouter.use("/anomalies", anomaliesRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/daily-sales", dailySalesRouter);
apiRouter.use("/datasets", datasetsRouter);
apiRouter.use("/health", healthRouter);
apiRouter.use("/users", usersRouter);
