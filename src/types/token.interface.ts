import { Request, Response } from "express";
import UserDocument from "../types/user.types";
interface TokenArgs {
  req: Request;
  res: Response;
  user: UserDocument;
}
export default TokenArgs;
