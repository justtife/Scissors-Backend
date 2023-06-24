import { Request, Response, NextFunction } from "express";
import CustomError from "../utils/errors/customError";
import { StatusCode, ErrorResponse } from "../types";
import logger from "../utils/logger/logger";
const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let customError: Omit<ErrorResponse, "status"> = {
    message: err.message,
    statusCode: err.statusCode,
    code: err.errorCode,
  };
  //Different cases of errors
  switch (true) {
    case err.name === "ValidationError":
      customError.message = err.message;
      customError.code = StatusCode.BADREQUEST_ERROR;
      customError.statusCode = StatusCode.BAD_REQUEST;
      break;
    case err.name === "TypeError":
      customError.message = "Type error";
      customError.statusCode = StatusCode.BAD_REQUEST;
      customError.data = err.message;
      break;
    default:
      customError.message =
        err.name || "An error occured, please try again later";
      customError.statusCode =
        err.statusCode || StatusCode.INTERNAL_SERVER_ERROR;
      customError.data = err.message;
      break;
  }
  const output: ErrorResponse = {
    message: customError.message,
    status: "failed",
    data: customError.data,
    code: customError.code,
  };
  console.log(err);
  logger.error(`${output}, ${err}`);
  res.status(customError.statusCode).json(output);
};
export default errorHandler;
