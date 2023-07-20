import CustomError from "./customError";
import { StatusCode } from "../../types";
export default class BadGatewayError extends CustomError {
  constructor(
    message: string,
    readonly name: string = "BadGatewayError",
    readonly statusCode: number = StatusCode.BAD_GATEWAY,
    readonly errorCode: number = StatusCode.BADGATEWAY_ERROR
  ) {
    super(message, statusCode, errorCode);
    this.name = name;
  }
}
