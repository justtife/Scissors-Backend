import { Router } from "express";
import UserValidation from "../utils/validations/user.validation";
import Auth from "../utils/auth/authenticateUser";
import _ from "lodash";
export const userRouter = Router();
import { UserController } from "../controllers/user.controller";
import { ImageUploader } from "../utils/image/multer";
const upload = new ImageUploader();
userRouter.post(
  "/upload",
  upload.uploadErrorHandlerMiddleware.bind(upload),
  UserController.uploadImage
);
userRouter.post(
  "/signup",
  UserValidation.createUser,
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
  UserValidation.getAllUsers,
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
