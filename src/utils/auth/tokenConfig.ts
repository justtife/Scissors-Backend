import { sign } from "jsonwebtoken";
import { UserDocument, AttachCookiesToResponse } from "../../types";
import config from "../../config/config";
//Create Token User
const tokenUser = (user: UserDocument): object => {
  return {
    name: user.name.first,
    userID: user.userID,
    role: user.accountStatus?.role,
  };
};
//Create Token
interface Payload {
  payload: object | any;
}
const createJWT = (payload: Payload): string => {
  const token = sign(payload.payload, config.JWT_SECRET, {
    //Token Expires in One Hour
    expiresIn: "1h",
  });
  return token;
};
//Attach Cookies To Response
const attachCookiesToResponse = (
  cookieObject: AttachCookiesToResponse
): string => {
  //Destructure the cookieobject
  let { res, user, refreshToken } = cookieObject;
  //Create access token
  const accessTokenJWT = createJWT({ payload: { user } });
  //Create refresh token
  const refreshTokenJWT = createJWT({ payload: { user, refreshToken } });
  //Cookie expiry time
  const oneHour = 60 * 60 * 1000;
  const sixHours = 6 * 60 * 60 * 1000;
  //Access Token
  res.cookie("accessToken", accessTokenJWT, {
    httpOnly: true,
    signed: true,
    expires: new Date(Date.now() + oneHour),
    secure: false,
  });
  //Refresh Token to refresh accessToken on every request
  res.cookie("refreshToken", refreshTokenJWT, {
    httpOnly: true,
    signed: true,
    expires: new Date(Date.now() + sixHours),
    secure: false,
  });
  return accessTokenJWT;
};
export { tokenUser, createJWT, attachCookiesToResponse };
