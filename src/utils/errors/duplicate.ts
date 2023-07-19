import CustomError from "./customError";
import { StatusCode } from "../../types";
export default class DuplicateError extends CustomError {
  constructor(
    message: string,
    readonly name: string = "DuplicateError",
    readonly statusCode: number = StatusCode.CONFLICT,
    readonly errorCode: number = StatusCode.DUPLICATE_ERROR
  ) {
    super(message, statusCode, errorCode);
    this.name = name;
  }
}
