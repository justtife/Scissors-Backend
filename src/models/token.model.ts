import { Schema, model } from "mongoose";
import { TokenDocument } from "../types";
const TokenSchema = new Schema({
  refreshToken: { type: String, required: true },
  ip: { type: String, required: true },
  userAgent: { type: String, required: true },
  user: {
    type: String,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
// Set a token expiry when token not in use
TokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 6 * 3600 });
export default model<TokenDocument>("Token", TokenSchema);
