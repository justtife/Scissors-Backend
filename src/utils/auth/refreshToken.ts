import config from "../../config/config";
import { verify } from "jsonwebtoken";
import Token from "../../models/token.model";
import User from "../../models/user.model";
import { createToken } from "../auth";
import { UserDocument, AttachCookiesToResponse } from "../../types";
import { UnAuthorizedError } from "../errors";
import { Request, Response } from "express";
async function refreshToken(req: Request, res: Response) {
  const refreshToken = req.signedCookies.refreshToken;
  if (!refreshToken) {
    throw new UnAuthorizedError("You are not signed in, please sign in");
  }
  const decodedToken = verify(
    refreshToken,
    config.JWT_SECRET
  ) as AttachCookiesToResponse;
  const refreshTokenExists = await Token.findOne({
    user: decodedToken.user.userID,
    refreshToken: decodedToken.refreshToken,
  });
  if (!refreshTokenExists) {
    throw new UnAuthorizedError("You are not signed in, please sign in");
  }
  let user = (await User.findOne({
    userID: decodedToken.user.userID,
  })) as UserDocument;
  await createToken({ req, res, user });
  res.status(200).json();
}
export default refreshToken;
