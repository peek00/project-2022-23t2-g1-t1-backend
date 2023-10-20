import { Request, Response, NextFunction } from "express";
import { CustomError } from "./customError";

export const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (error instanceof CustomError) {
    res
      .status(error.statusCode)
      .send({ error: error.name, message: error.message });
  } else {
    res
      .status(500)
      .send({ error: "Internal Server Error", message: error.message });
  }
};
