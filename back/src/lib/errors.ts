import { ValidationError } from "class-validator";
import { NextFunction, Request, Response } from "express";
import { ValidateError } from "tsoa";
import { QueryFailedError } from "typeorm";

export const PG_UNIQUE_CONSTRAINT_VIOLATION = "23505";

export class ConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConflictError";
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof ValidateError) {
    res.status(422).json({
      message: "Validation failed",
      details: err.fields,
    });
    return;
  }

  if (Array.isArray(err) && err[0] instanceof ValidationError) {
    res.status(422).json({
      message: "Validation failed",
      details: err.map((e: ValidationError) => ({
        field: e.property,
        constraints: e.constraints,
      })),
    });
    return;
  }

  if (err instanceof ConflictError) {
    res.status(409).json({
      message: err.message,
    });
    return;
  }

  if (err instanceof NotFoundError) {
    res.status(404).json({
      message: err.message,
    });
    return;
  }

  console.error("Unexpected error: ", err);
  res.status(500).json({ message: "Internal Server Error" });
}

export function isUniqueConstraintViolation(error: unknown): boolean {
  return (
    error instanceof QueryFailedError &&
    error.driverError.code === PG_UNIQUE_CONSTRAINT_VIOLATION
  );
}
