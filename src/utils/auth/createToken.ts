import Token from "../../models/token.model";
import { TokenDocument, TokenArgs, User } from "../../types";
import { tokenUser, attachCookiesToResponse } from "./tokenConfig";
import crypto from "crypto-js";
/**
 *
 * @param tokenArg
 * @returns accessToken
 */
const token = async (tokenArg: TokenArgs) => {
  let { req, res, user } = tokenArg;
  //Create user payload
  const userToken = tokenUser(user);
  let refreshToken;
  //Check for existing token
  //Verify the user has been logged in before
  const existingToken = <TokenDocument>(
    await Token.findOne({ user: user.userID })
  );
  if (existingToken) {
    //Attach the existing token to cookies if there is an exsting token
    refreshToken = existingToken.refreshToken;
    return attachCookiesToResponse({
      res,
      user: userToken as User,
      refreshToken,
    });
  } else {
    //Number of byte
    const numBytes: number = 32;
    //If there is no existing token, create new token collection and attach to cookies
    const randomBytes = crypto.lib.WordArray.random(numBytes);
    refreshToken = randomBytes.toString(crypto.enc.Hex);
    const userAgent = req.headers["user-agent"];
    const ip = req.ip;
    const newUserToken = { refreshToken, ip, userAgent, user: user.userID };
    await Token.create(newUserToken);
    return attachCookiesToResponse({
      res,
      user: userToken as User,
      refreshToken,
    });
  }
};
export default token;
