import CustomError from "./customError";
import { StatusCode } from "../../types";
export default class UnsupportedMediaTypeError extends CustomError {
  constructor(
    message: string,
    readonly name: string = "UnsupportedMediaTypeError",
    readonly statusCode: number = StatusCode.UNSUPPORTED_MEDIA_TYPE,
    readonly errorCode: number = StatusCode.BADREQUEST_ERROR
  ) {
    super(message, statusCode, errorCode);
    this.name = name;
  }
}
