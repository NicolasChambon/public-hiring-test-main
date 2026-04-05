import { ValidationError } from "class-validator";
import { NextFunction, Request, Response } from "express";
import { ValidateError } from "tsoa";

export function validationErrorHandler(
  err: unknown,
  _: Request,
  res: Response,
  next: NextFunction,
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

  next(err);
}
