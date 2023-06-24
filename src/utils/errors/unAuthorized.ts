import CustomError from "./customError";
import { StatusCode } from "../../types";
export default class UnAuthorizedError extends CustomError {
  constructor(
    message: string,
    readonly statusCode: number = StatusCode.UNAUTHORIZED,
    readonly errorCode: number = StatusCode.AUTH_ERROR
  ) {
    super(message, statusCode, errorCode);
    this.message = message;
  }
}
