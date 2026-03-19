import { Router } from "express";

import { getApiOverview } from "../controllers/system.controller";
import { healthRouter } from "./health.routes";

export const apiRouter = Router();

apiRouter.get("/", getApiOverview);
apiRouter.use("/health", healthRouter);
