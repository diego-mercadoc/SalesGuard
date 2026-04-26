import { Router } from "express";

import {
  createDataset,
  deleteDataset,
  getAllDatasets,
  getDatasetById,
  updateDataset
} from "../controllers/datasets.controller";
import { authenticateToken } from "../middlewares/auth.middleware";
import { requireAdmin } from "../middlewares/role.middleware";

export const datasetsRouter = Router();

datasetsRouter.use(authenticateToken);

datasetsRouter.get("/", getAllDatasets);
datasetsRouter.get("/:id", getDatasetById);
datasetsRouter.post("/", createDataset);
datasetsRouter.put("/:id", updateDataset);
datasetsRouter.delete("/:id", requireAdmin, deleteDataset);
