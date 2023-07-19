import { Request, Response } from "express";
import NotFoundError from "../utils/errors/notFound";
const notFound = (req: Request, res: Response) => {
  throw new NotFoundError(`Route ${req.originalUrl} does not exist`);
};
export default notFound;
