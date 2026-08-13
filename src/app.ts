import express from "express";
import Routes from "./routes/index.js";
import { API_BASE_PATH } from "./utils/constants.js";

const app = express();

app.use(express.json());

app.use(API_BASE_PATH, Routes);

export default app;