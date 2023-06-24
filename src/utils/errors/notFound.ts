import CustomError from "./customError";
import { StatusCode } from "../../types";
export default class NotFoundError extends CustomError {
  constructor(
    message: string,
    readonly statusCode: number = StatusCode.NOT_FOUND,
    readonly errorCode: number = StatusCode.BADREQUEST_ERROR
  ) {
    super(message, statusCode, errorCode);
    this.message = message;
  }
}
