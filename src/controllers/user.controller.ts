import { Request, Response, NextFunction } from "express";
import { token as createToken } from "../utils/auth/createToken";
import { mainConfig } from "../config/config";
import Auth from "../utils/auth/authenticateUser";
import { deleteImage } from "../utils/helpers/cloudinary";
import { v4 as uuidv4 } from "uuid";
const config = mainConfig[process.env.APP_ENV as string];
import {
  StatusCode,
  UserDocument,
  SuccessResponse,
  ErrorResponse,
} from "../types";
import passport from "passport";
import CustomError from "../utils/errors";
import UserService from "../services/user.service";
import EmailSender from "../utils/mails/mailSetUp";
import saveOnCloudinary from "../utils/helpers/cloudinary";
const _ = require("lodash");
export class UserController {
  static async uploadImage(req: Request, res: Response) {
    const file = req!.file!.path;
    const result = await saveOnCloudinary(
      file,
      `profilePic_${uuidv4().slice(0, 10)}`,
      "scissors_user"
    );
    let output: SuccessResponse = {
      message: "Image uploaded successfully",
      data: result.public_id + " " + result.url,
    };
    res.status(200).json(output);
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
          let infoMessage: ErrorResponse = {
            status: "failed",
            message: info.message,
            code: info.code || StatusCode.BADREQUEST_ERROR,
          };
          return res.status(info.statusCode).json(infoMessage);
        }
        //Log user in after signing up
        req.logIn(user, async (err) => {
          if (err) {
            return next(err);
          }
          let token = await createToken({ req, res, user });
          const output: SuccessResponse = {
            status: "success",
            message: "Signup successful",
            token,
            data: _.omit(Object.values(user)[1], [
              "password",
              "accountStatus.isActive",
              "googleID",
              "nationality",
              "passwordResetToken",
              "passwordResetExpiry",
              "updatedAt",
              "__v",
            ]),
          };
          return res.status(StatusCode.CREATED).json(output);
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
        if (info || !user) {
          let infoMessage: ErrorResponse = {
            message: info.message,
            code: StatusCode.BADREQUEST_ERROR,
          };
          return res.status(info.statusCode).json(infoMessage);
        }
        req.logIn(user, async (err) => {
          if (err) {
            return next(err);
          }
          let token = await createToken({ req, res, user });
          const output: SuccessResponse = {
            status: "success",
            message: "Login successful",
            token,
            data: _.omit(Object.values(user)[2], [
              "password",
              "accountStatus.isActive",
              "googleID",
              "nationality",
              "passwordResetToken",
              "passwordResetExpiry",
              "updatedAt",
              "__v",
            ]),
          };
          return res.status(StatusCode.OK).json(output);
        });
      }
    )(req, res, next);
  }
  static async getAllUsers(req: Request, res: Response) {
    const users = await UserService.getAllUsers();
    const output: SuccessResponse = {
      message: "All users",
      data:
        users !== null
          ? _.omit(Object.values(users), [
              "password",
              "accountStatus.isActive",
              "googleID",
              "nationality",
              "passwordResetToken",
              "passwordResetExpiry",
              "updatedAt",
              "__v",
            ])
          : undefined,
    };
    res.status(StatusCode.OK).json(output);
  }
  static async getSingleUser(req: Request, res: Response) {
    const user = await UserService.getUserByUserID(req.params.userID);
    await Auth.checkPermission(req.user as UserDocument, user!.userID);
    const output: SuccessResponse = {
      message: `User Profile`,
      data:
        user !== null
          ? _.omit(Object.values(user)[2], [
              "password",
              "accountStatus.isActive",
              "googleID",
              "passwordResetToken",
              "passwordResetExpiry",
              "updatedAt",
              "__v",
            ])
          : undefined,
    };
    res.status(StatusCode.OK).json(output);
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
    const output: SuccessResponse = {
      message: `User profile successfully updated`,
      data:
        user !== null
          ? _.omit(Object.values(user)[2], [
              "password",
              "accountStatus.isActive",
              "googleID",
              "nationality",
              "passwordResetToken",
              "passwordResetExpiry",
              "updatedAt",
              "__v",
            ])
          : undefined,
    };
    res.status(StatusCode.OK).json(output);
  }
  static async changeEmail(req: Request, res: Response) {
    const user = await UserService.getUserByEmail(req.body.oldEmail);
    if (!user) {
      throw new CustomError.NotFoundError(
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
        throw new CustomError.BadRequestError(
          `User with email ${req.body.newEmail} already exists, please try again with another email`
        );
      } else {
        user!.email = req.body.newEmail;
      }
    }
    await user?.save();
    const output: SuccessResponse = {
      message: `User Email updated successfully`,
      data:
        user !== null
          ? _.omit(Object.values(user)[2], [
              "password",
              "accountStatus.isActive",
              "googleID",
              "nationality",
              "passwordResetToken",
              "passwordResetExpiry",
              "updatedAt",
              "__v",
            ])
          : undefined,
    };
    res.status(StatusCode.OK).json(output);
  }
  static async sendResetPasswordMail(req: Request, res: Response) {
    const user = await UserService.getUserByEmail(req.body.email);
    if (!user) {
      throw new CustomError.NotFoundError(
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
    const output: SuccessResponse = {
      message: `Reset Password mail has been sent to your mail`,
      data:
        user !== null
          ? _.omit(Object.values(user)[2], [
              "password",
              "accountStatus.isActive",
              "googleID",
              "nationality",
              "passwordResetToken",
              "passwordResetExpiry",
              "updatedAt",
              "__v",
            ])
          : undefined,
    };
    res.status(StatusCode.OK).json(output);
  }
  static async changePassword(req: Request, res: Response) {
    const user = await UserService.getUserByUserID(req.params.userID);
    await Auth.checkPermission(req.user as UserDocument, user!.userID);
    const validateOldPassword = await user?.isValidPassword(
      req.body.oldPassword
    );
    if (!validateOldPassword) {
      throw new CustomError.BadRequestError(
        "Old password Incorrect, enter a correct password"
      );
    }
    user!.password = req.body.newPassword;
    await user?.save();
    const output: SuccessResponse = {
      message: `User password successfully updated`,
      data:
        user !== null
          ? _.omit(Object.values(user)[2], [
              "password",
              "accountStatus.isActive",
              "googleID",
              "nationality",
              "passwordResetToken",
              "passwordResetExpiry",
              "updatedAt",
              "__v",
            ])
          : undefined,
    };
    res.status(StatusCode.OK).json(output);
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
    const output: SuccessResponse = {
      message: "Password has been changed successfully",
    };
    res.status(StatusCode.OK).json(output);
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
    const output: SuccessResponse = {
      message: `User Logged out`,
    };
    res.status(StatusCode.OK).json(output);
  }
  static async deleteAccount(req: Request, res: Response, next: NextFunction) {
    const user = await UserService.getUserByUserID(req.params.userID);
    await Auth.checkPermission(req.user as UserDocument, user!.userID);
    const validateOldPassword = await user!.isValidPassword(req.body.password);
    if (!validateOldPassword) {
      throw new CustomError.BadRequestError(
        "Password Incorrect, enter the correct password"
      );
    }
    if (user?.profilePic) {
      await deleteImage(user.profilePic.split(" ")[0]);
    }
    await deleteImage(<string>user!.defaultPic);
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
    const output: SuccessResponse = {
      message: "User Account successfully deleted",
    };
    res.status(StatusCode.OK).json(output);
  }
}
