import { Response } from "express";
export interface User {
  name: string;
  userID: string;
  role: string;
}
export interface AttachCookiesToResponse {
  res: Response;
  user: User;
  refreshToken: string;
}
