import { Schema, model } from "mongoose";
import StatDocument from "../types/stat.types";
const StatSchema = new Schema<StatDocument>(
  {
    short_url: {
      type: String,
      required: true,
    },
    ip: { type: String, required: true },
    city: { type: String, required: true, default: "Unknown" },
    countryName: String,
    countryCapital: String,
    countryFlag: String,
    continentName: String,
    user: String,
  },
  { timestamps: true }
);

// StatSchema.index({ user: 1, short_url: 1 }, { unique: true });
export default model<StatDocument>("Stat", StatSchema);
