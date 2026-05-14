import { Router } from "express";

import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser
} from "../controllers/users.controller";
import { authenticateToken } from "../middlewares/auth.middleware";
import { requireAdmin } from "../middlewares/role.middleware";

export const usersRouter = Router();

usersRouter.use(authenticateToken, requireAdmin);

usersRouter.get("/", getAllUsers);
usersRouter.get("/:id", getUserById);
usersRouter.post("/", createUser);
usersRouter.put("/:id", updateUser);
usersRouter.delete("/:id", deleteUser);
