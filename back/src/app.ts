import express, { json, urlencoded } from "express";
import { RegisterRoutes } from "../build/routes";
import { errorHandler } from "./lib/errors";
import cors from "cors";

export const initializeApp = async () => {
  const app = express();

  // Use body parser to read sent json payloads
  app.use(urlencoded({ extended: true }));
  app.use(json());

  app.use(cors({ origin: "http://localhost:3001" }));

  RegisterRoutes(app);
  app.use(errorHandler);
  return app;
};
