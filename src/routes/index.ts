import { Router } from "express";

import { getApiOverview } from "../controllers/system.controller";
import { authRouter } from "./auth.routes";
import { healthRouter } from "./health.routes";
import { usersRouter } from "./users.routes";

export const apiRouter = Router();

apiRouter.get("/", getApiOverview);
apiRouter.use("/auth", authRouter);
apiRouter.use("/health", healthRouter);
apiRouter.use("/users", usersRouter);
