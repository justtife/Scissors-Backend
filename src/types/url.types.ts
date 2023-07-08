import { Document } from "mongoose";
type UrlDocument = Document & {
  original_url: string;
  short_url: string;
  tag: string[];
  clicks: number;
  qrcode: string;
  description: string;
  custom: boolean;
  name: string;
  user?: string;
  isURLValid(url: string): Promise<Error | boolean>;
};
export default UrlDocument;
