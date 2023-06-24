import { Request, Response } from "express";
import { StatusCode, ErrorResponse } from "../types";
const notFound = (req: Request, res: Response) => {
  const output: ErrorResponse = {
    status: "failed",
    message: `Route ${req.originalUrl} does not exist`,
  };
  res.status(StatusCode.NOT_FOUND).json(output);
};
export default notFound;
