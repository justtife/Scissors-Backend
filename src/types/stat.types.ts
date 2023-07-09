import { Document, Types } from "mongoose";

type StatDocument = Document & {
  short_url: string;
  ip: string;
  city: string;
  continentName?: string;
  countryName?: string;
  countryCapital?: string;
  countryFlag?: string;
  user: String | "Anonymous";
};
export default StatDocument;
