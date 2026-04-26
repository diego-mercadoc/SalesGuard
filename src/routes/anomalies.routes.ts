import { Router } from "express";

import {
  getAllAnomalies,
  getAnomalyById,
  runAnomalyAnalysis
} from "../controllers/anomalies.controller";
import { authenticateToken } from "../middlewares/auth.middleware";

export const anomaliesRouter = Router();

anomaliesRouter.use(authenticateToken);

anomaliesRouter.get("/", getAllAnomalies);
anomaliesRouter.get("/:id", getAnomalyById);
anomaliesRouter.post("/run/:datasetId", runAnomalyAnalysis);
