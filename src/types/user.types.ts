import { Document } from "mongoose";
interface User {
  first: string;
  last: string;
  user: string;
}
interface AccountStatus {
  role: "user" | "admin" | "owner";
  isActive: Boolean;
}
type UserDocument = Document & {
  name: User;
  email: string;
  password: string;
  userID: string;
  accountStatus?: AccountStatus;
  defaultPic?: string;
  profilePic?: string;
  googleID?: string;
  sex?: "male" | "female" | "other";
  nationality?: string;
  passwordResetToken?: string;
  passwordResetExpiry?: string;
  isValidPassword(password: string): Promise<Error | boolean>;
  sendResetPasswordMail(): Promise<Error | string>;
  validateResetPasswordToken(
    resetToken: string,
    newPassword: string
  ): Promise<Error | void>;
  makeRemoveAdmin(role: string): Promise<Error | void>;
};
export default UserDocument;
