import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";

import { apiRouter } from "./routes";

dotenv.config();

export const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use(apiRouter);
