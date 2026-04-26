import { Router } from "express";

import { authRouter } from "./auth.routes";
import { datasetsRouter } from "./datasets.routes";
import { getApiOverview } from "../controllers/system.controller";
import { healthRouter } from "./health.routes";
import { usersRouter } from "./users.routes";

export const apiRouter = Router();

apiRouter.get("/", getApiOverview);
apiRouter.use("/auth", authRouter);
apiRouter.use("/datasets", datasetsRouter);
apiRouter.use("/health", healthRouter);
apiRouter.use("/users", usersRouter);
