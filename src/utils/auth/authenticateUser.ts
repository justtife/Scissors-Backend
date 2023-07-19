import { Request, Response, NextFunction } from "express";
import { StatusCode, ErrorResponse } from "../../types";
import passport from "passport";
import { UserDocument } from "../../types";
import { UnAuthorizedError } from "../errors";
class Auth {
  static async authUser(req: Request, res: Response, next: NextFunction) {
    passport.authenticate("jwt", function (err: Error, user: any, info: any) {
      if (err) {
        return next(err);
      }
      if (info) {
        let errorMessage: ErrorResponse = {
          message: "You are not signed in, please sign in",
          code: StatusCode.AUTH_ERROR,
          statusCode: StatusCode.UNAUTHORIZED,
        };
        return res.status(StatusCode.UNAUTHORIZED).json(errorMessage);
      }
      req.user = user;
      return next();
    })(req, res, next);
  }
  static async authenticateJwt(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      return new Promise((resolve, reject) => {
        passport.authenticate(
          "jwt",
          function (err: Error, user: any, info: any) {
            if (err) {
              reject(err); // Reject the promise with the error
            }
            if (info) {
              resolve(false); // User is not logged in
            }
            req.user = user;
            resolve(true); // User is logged in
          }
        )(req, res, next);
      });
    } catch (error) {
      return false;
    }
  }
  static async checkPermission(
    requestUser: UserDocument,
    resourceUserId: string
  ) {
    if (
      requestUser.accountStatus &&
      (requestUser.accountStatus.role === "admin" ||
        requestUser.accountStatus.role === "owner")
    )
      return;
    if (requestUser.userID === resourceUserId.toString()) return;
    throw new UnAuthorizedError(
      "You are unauthorized to carry out this operation"
    );
  }
  static authorizePermissions = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
      let user: UserDocument = req.user as UserDocument;
      if (
        !user ||
        !user.accountStatus ||
        !roles.includes(user.accountStatus.role)
      ) {
        throw new UnAuthorizedError("Unauthorized to access this route");
      }
      next();
    };
  };
}
export default Auth;
