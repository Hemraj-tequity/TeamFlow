import express from "express";
import Routes from "./routes/index.js";
import { API_BASE_PATH } from "./utils/constants.js";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.js";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

app.use(API_BASE_PATH, Routes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;