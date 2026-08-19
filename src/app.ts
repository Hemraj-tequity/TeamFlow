import express from "express";
import Routes from "./routes/index.js";
import { API_BASE_PATH } from "./utils/constants.js";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.js";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

const app = express();
app.use(helmet());
app.use(express.json());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(cookieParser());

app.use(API_BASE_PATH, Routes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;