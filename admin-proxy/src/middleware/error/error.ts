import { Request, Response, NextFunction } from "express";
import { CustomError, InvalidSessionError } from "./customError";

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (error instanceof InvalidSessionError) {
    res.clearCookie("jwt");
  }
  if (error instanceof CustomError) {
    console.error(error.message);
    res
      .status(error.statusCode)
      .send({ error: error.name, message: error.message });
  } else {
    res
      .status(500)
      .send({ error: "Internal Server Error", message: error.message });
  }
};
