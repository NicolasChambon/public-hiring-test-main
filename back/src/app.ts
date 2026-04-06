import express, { json, urlencoded } from "express";
import { RegisterRoutes } from "../build/routes";
import { errorHandler } from "./lib/errors";
import cors from "cors";

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3001";

export const initializeApp = async () => {
  const app = express();

  app.use(cors({ origin: FRONTEND_URL }));

  // Use body parser to read sent json payloads
  app.use(urlencoded({ extended: true }));
  app.use(json());

  RegisterRoutes(app);
  app.use(errorHandler);
  return app;
};
