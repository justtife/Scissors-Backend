import { Response } from "express";
import { StatusCode, SuccessResponse, ErrorResponse } from "../types";
interface OutputResponse {
  res: Response;
  message: string;
  data?: object | string | null | string[];
  statusCode?: number;
  code?: number;
  token?: string;
}
export const successResponse = ({
  res,
  message,
  data,
  statusCode,
  token,
}: OutputResponse) => {
  const output: SuccessResponse = {
    status: "success",
    message,
    data,
    token,
    statusCode: statusCode || StatusCode.OK,
    code: StatusCode.SUCCESS_RESPONSE,
  };
  res.status(output.statusCode as number).json(output);
};
export const errorResponse = ({
  res,
  message,
  data,
  statusCode,
  code,
}: OutputResponse) => {
  const output: ErrorResponse = {
    status: "failed",
    message,
    data,
    statusCode: statusCode || StatusCode.BAD_REQUEST,
    code: code || StatusCode.ERROR_RESPONSE,
  };
  res.status(output.statusCode as number).json(output);
};
