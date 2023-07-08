import { Schema, model} from "mongoose";
import { UrlDocument } from "../types";

const UrlSchema = new Schema<UrlDocument>(
  {
    original_url: { type: String, required: true },
    short_url: {
      type: String,
      required: true,
    },
    custom: { type: Boolean, default: false },
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
