import express, { json, urlencoded } from "express";
import { RegisterRoutes } from "../build/routes";
import { errorHandler } from "./lib/errors";

export const initializeApp = async () => {
  const app = express();

  // Use body parser to read sent json payloads
  app.use(urlencoded({ extended: true }));
  app.use(json());

  RegisterRoutes(app);
  app.use(errorHandler);
  return app;
};
