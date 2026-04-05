import express, { json, urlencoded } from "express";

import { RegisterRoutes } from "../build/routes";
import { GreenlyDataSource } from "../config/dataSource";
import { validationErrorHandler } from "./lib/errors";

export const app = express();

// Use body parser to read sent json payloads
app.use(
  urlencoded({
    extended: true,
  }),
);
app.use(json());

// Initialize database connection before registering routes
export const initializeApp = async () => {
  GreenlyDataSource.getInstance();
  RegisterRoutes(app);

  app.use(validationErrorHandler);

  return app;
};
