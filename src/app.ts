import cors from "cors";
import express from "express";
import morgan from "morgan";

import { env } from "./config/env";
import { errorHandler } from "./middlewares/error.middleware";
import { notFoundHandler } from "./middlewares/not-found.middleware";
import { apiRouter } from "./routes";

export const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use(env.apiPrefix, apiRouter);
app.use(notFoundHandler);
app.use(errorHandler);
