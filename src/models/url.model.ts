import { Schema, model, Document } from "mongoose";
import { UrlDocument } from "../types";
import { v4 as uuidv4 } from "uuid";
import Stat from "./stat.model";

const UrlSchema = new Schema<UrlDocument>(
  {
    original_url: { type: String, required: true },
    short_url: {
      type: String,
      required: true,
      default: uuidv4().slice(0, 6),
    },
    tag: Array,
    qrcode: String,
    clicks: { type: Number, default: 0 },
    description: String,
    name: String,
    user: { type: String, default: "Anonymous" },
  },
  { timestamps: true }
);


export default model<UrlDocument>("Url", UrlSchema);
