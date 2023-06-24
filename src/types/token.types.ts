import { Document } from "mongoose";
type TokenDocument = Document & {
  refreshToken: string;
  ip: string;
  userAgent: string;
  user: string;
};
export default TokenDocument;