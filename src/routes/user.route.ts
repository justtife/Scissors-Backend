import { Request, Response, Router } from "express";
import UserValidation from "../utils/validations/user.validation";
import Auth from "../utils/auth/authenticateUser";
import _ from "lodash";
export const userRouter = Router();
import { UserController } from "../controllers/user.controller";
import ImageUploader from "../utils/image/multer";
import passport = require("passport");
userRouter.post(
  "/signup",
  UserValidation.createUser,
  ImageUploader.upload.single("profilePic"),
  UserController.createUser
);
userRouter.post("/login", UserValidation.loginUser, UserController.loginUser);
userRouter.post("/logout", UserController.logout);

userRouter.post(
  "/password/verify",
  UserValidation.verifyPassword,
  UserController.validateResetPassword
);
userRouter.get(
  "/users",
  Auth.authUser,
  Auth.authorizePermissions("admin", "owner"),
  UserController.getAllUsers
);
userRouter.patch(
  "/change-email",
  Auth.authUser,
  UserValidation.changeEmail,
  UserController.changeEmail
);
userRouter
  .route("/:userID")
  .get(
    Auth.authUser,
    UserValidation.getSingleUser,
    UserController.getSingleUser
  )
  .patch(Auth.authUser, UserValidation.updateUser, UserController.updateUser)
  .delete(
    Auth.authUser,
    UserValidation.deleteUserAccount,
    UserController.deleteAccount
  );
userRouter.post(
  "/reset-password",
  UserValidation.sendResetPasswordEmail,
  UserController.sendResetPasswordMail
);
userRouter.patch(
  "/:userID/change-password",
  UserValidation.changePassword,
  UserController.changePassword
);

