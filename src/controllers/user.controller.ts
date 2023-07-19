import { Request, Response, NextFunction } from "express";
import { token as createToken } from "../utils/auth/createToken";
import Auth from "../utils/auth/authenticateUser";
import { v4 as uuidv4 } from "uuid";
import { successResponse, errorResponse } from "../middlewares/outputHandler";
import config from "../config/config";
import { StatusCode, UserDocument, SuccessResponse, UserQuery } from "../types";
import passport from "passport";
import {
  BadRequestError,
  DuplicateError,
  NotFoundError,
} from "../utils/errors";
import UserService from "../services/user.service";
import EmailSender from "../utils/mails/mailSetUp";
import saveOnCloudinary from "../utils/helpers/cloudinary";
const _ = require("lodash");
const omitData = [
  "password",
  "accountStatus.isActive",
  "googleID",
  "nationality",
  "passwordResetToken",
  "passwordResetExpiry",
  "updatedAt",
  "__v",
];
export class UserController {
  static async uploadImage(req: Request, res: Response) {
    const file = req!.file!.path;
    const result = await saveOnCloudinary(
      file,
      `profilePic_${uuidv4().slice(0, 10)}`,
      "scissors_user"
    );
    successResponse({
      res,
      message: "Image uploaded successfully",
      data: result.public_id + " " + result.url,
    });
  }
  static async createUser(req: Request, res: Response, next: NextFunction) {
    passport.authenticate(
      "signup",
      function (err: Error, user: UserDocument, info: any) {
        if (err) {
          return next(err); // will generate an error with status code 500
        }
        //If any Error, info about the Error is generated
        if (info) {
          errorResponse({
            res,
            message: info.message,
            code: info.code || StatusCode.BADREQUEST_ERROR,
            statusCode: info.statusCode,
          });
        }
        //Log user in after signing up
        req.logIn(user, async (err) => {
          if (err) {
            return next(err);
          }
          let token = await createToken({ req, res, user });
          successResponse({
            res,
            message: "Signup successful",
            data: _.omit(Object.values(user)[1], omitData),
            token,
            statusCode: StatusCode.CREATED,
          });
        });
      }
    )(req, res, next);
  }
  static async loginUser(req: Request, res: Response, next: NextFunction) {
    passport.authenticate(
      "login",
      async (err: Error, user: UserDocument, info: any) => {
        if (err) {
          return next(err);
        }
        if (info) {
          errorResponse({
            res,
            message: info.message,
            code: info.code || StatusCode.BADREQUEST_ERROR,
            statusCode: info.statusCode,
          });
        }
        req.logIn(user, async (err) => {
          if (err) {
            return next(err);
          }
          let token = await createToken({ req, res, user });
          successResponse({
            res,
            message: "Login successful",
            data: _.omit(Object.values(user)[2], omitData),
            token,
          });
        });
      }
    )(req, res, next);
  }
  static async getAllUsers(req: Request, res: Response) {
    const { search, role, is_active } = req.query as UserQuery;
    const page = Number(req.query.skip) || 1;
    const skip = (page - 1) * 10;
    const users = await UserService.getAllUsers(
      { search, role, is_active },
      skip
    );
    const output: SuccessResponse = {
      message: "All users",
      //@ts-ignore
      data: users,
    };
    res.status(StatusCode.OK).json(output);
  }
  static async getSingleUser(req: Request, res: Response) {
    const user = await UserService.getUserByUserID(req.params.userID);
    await Auth.checkPermission(req.user as UserDocument, user!.userID);
    successResponse({
      res,
      message: `User Profile`,
      data: _.omit(Object.values(user as UserDocument)[2], omitData),
    });
  }
  static async updateUser(req: Request, res: Response) {
    const user = await UserService.getUserByUserID(req.params.userID);
    await Auth.checkPermission(req.user as UserDocument, user!.userID);
    user!.name.first = req.body.firstname;
    user!.name.last = req.body.lastname;
    user!.name.user = req.body.username;
    user!.sex = req.body.sex;
    user!.nationality = req.body.nationality;
    if (req.body.profilePic) {
      user!.profilePic = req.body.profilePic;
    }
    await user?.save();
    successResponse({
      res,
      message: "User profile successfully updated",
      data: _.omit(Object.values(user as UserDocument)[2], omitData),
    });
  }
  static async changeEmail(req: Request, res: Response) {
    const user = await UserService.getUserByEmail(req.body.oldEmail);
    if (!user) {
      throw new NotFoundError(
        `User with email:${req.body.oldEmail} does not exist`
      );
    }
    await Auth.checkPermission(req.user as UserDocument, user!.userID);
    if (req.body.oldEmail === req.body.newEmail) {
      user!.email = req.body.oldEmail;
    } else {
      const checkMailExists = await UserService.getUserByEmail(
        req.body.newEmail
      );
      if (checkMailExists) {
        throw new DuplicateError(
          `User with email ${req.body.newEmail} already exists, please try again with another email`
        );
      } else {
        user!.email = req.body.newEmail;
      }
    }
    await user?.save();
    successResponse({
      res,
      message: "User Email updated successfully",
      data: _.omit(Object.values(user)[2], omitData),
    });
  }
  static async sendResetPasswordMail(req: Request, res: Response) {
    const user = await UserService.getUserByEmail(req.body.email);
    if (!user) {
      throw new NotFoundError(
        `User with email:${req.body.email} does not exist`
      );
    }
    const resetPasswordToken = await user!.sendResetPasswordMail();
    const emailSender = new EmailSender();
    emailSender.sendResetPasswordEmail(
      user!.name.first,
      user!.email,
      `${config.APP_LINK}/user/verify-password?passwordToken=${resetPasswordToken}`
    );
    successResponse({
      res,
      message: "Reset Password mail has been sent to your mail",
    });
  }
  static async changePassword(req: Request, res: Response) {
    const user = await UserService.getUserByUserID(req.params.userID);
    await Auth.checkPermission(req.user as UserDocument, user!.userID);
    const validateOldPassword = await user?.isValidPassword(
      req.body.oldPassword
    );
    if (!validateOldPassword) {
      throw new BadRequestError("Password Incorrect, enter a correct password");
    }
    user!.password = req.body.newPassword;
    await user?.save();
    successResponse({ res, message: "User password successfully updated" });
  }
  static async validateResetPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const user = await UserService.validateToken(
      req.query.passwordToken as string
    );
    await user.validateResetPasswordToken(
      req.query.passwordToken as string,
      req.body.newPassword
    );
    successResponse({ res, message: "Password has been changed successfully" });
  }
  static async logout(req: Request, res: Response, next: NextFunction) {
    await UserService.logUserOut(req.params.userID);
    //Change  Access token cookie and expire
    res.cookie("accessToken", "logout", {
      httpOnly: true,
      expires: new Date(Date.now()),
    });
    //Change refresh token cookie and expire
    res.cookie("refreshToken", "logout", {
      httpOnly: true,
      expires: new Date(Date.now()),
    });
    successResponse({ res, message: "User Logged out" });
  }
  static async deleteAccount(req: Request, res: Response, next: NextFunction) {
    const user = await UserService.getUserByUserID(req.params.userID);
    await Auth.checkPermission(req.user as UserDocument, user!.userID);
    const validateOldPassword = await user!.isValidPassword(req.body.password);
    if (!validateOldPassword) {
      throw new BadRequestError(
        "Password Incorrect, enter the correct password"
      );
    }
    if (user?.profilePic) {
      // await deleteImage(user.profilePic.split(" ")[0]);
    }
    // await deleteImage(<string>user!.defaultPic);
    await UserService.logUserOut(user!.userID);
    res.cookie("accessToken", "account deleted", {
      httpOnly: true,
      expires: new Date(Date.now()),
    });
    res.cookie("refreshToken", "account deleted", {
      httpOnly: true,
      expires: new Date(Date.now()),
    });
    await UserService.deleteUser(user!.userID);
    //Send Mail
    successResponse({ res, message: "User Account successfully deleted" });
  }
}
