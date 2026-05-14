import { Router } from "express";

import {
  getAuthenticatedUser,
  googleCallback,
  startGoogleLogin,
  loginUser,
  registerUser
} from "../controllers/auth.controller";
import { authenticateToken } from "../middlewares/auth.middleware";

export const authRouter = Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.get("/google", startGoogleLogin);
authRouter.get("/google/callback", googleCallback);
authRouter.get("/me", authenticateToken, getAuthenticatedUser);
