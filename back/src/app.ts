import express, { json, urlencoded } from "express";
import { RegisterRoutes } from "../build/routes";
import { errorHandler } from "./lib/errors";

export const app = express();

export const initializeApp = async () => {
  // Use body parser to read sent json payloads
  app.use(urlencoded({ extended: true }));
  app.use(json());

  RegisterRoutes(app);
  app.use(errorHandler);
  return app;
};
