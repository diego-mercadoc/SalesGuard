import { Router } from "express";

import {
  deleteUser,
  getUserById,
  listUsers,
  updateUser
} from "../controllers/users.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

export const usersRouter = Router();

usersRouter.use(authMiddleware);
usersRouter.get("/", listUsers);
usersRouter.get("/:id", getUserById);
usersRouter.patch("/:id", updateUser);
usersRouter.delete("/:id", deleteUser);
