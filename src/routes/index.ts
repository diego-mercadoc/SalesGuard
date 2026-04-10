import { Router } from "express";

import { authRouter } from "./auth.routes";
import { getApiOverview } from "../controllers/system.controller";
import { healthRouter } from "./health.routes";

export const apiRouter = Router();

apiRouter.get("/", getApiOverview);
apiRouter.use("/auth", authRouter);
apiRouter.use("/health", healthRouter);
