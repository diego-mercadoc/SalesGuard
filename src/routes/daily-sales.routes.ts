import { Router } from "express";

import {
  createDailySale,
  deleteDailySale,
  getAllDailySales,
  getDailySaleById,
  updateDailySale
} from "../controllers/daily-sales.controller";
import { authenticateToken } from "../middlewares/auth.middleware";
import { requireAdmin } from "../middlewares/role.middleware";

export const dailySalesRouter = Router();

dailySalesRouter.use(authenticateToken);

dailySalesRouter.get("/", getAllDailySales);
dailySalesRouter.get("/:id", getDailySaleById);
dailySalesRouter.post("/", createDailySale);
dailySalesRouter.put("/:id", updateDailySale);
dailySalesRouter.delete("/:id", requireAdmin, deleteDailySale);
