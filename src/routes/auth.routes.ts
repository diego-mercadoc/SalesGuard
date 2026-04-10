import { Router } from "express";

import { getAuthenticatedUser, loginUser, registerUser } from "../controllers/auth.controller";
import { authenticateToken } from "../middlewares/auth.middleware";

export const authRouter = Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.get("/me", authenticateToken, getAuthenticatedUser);
