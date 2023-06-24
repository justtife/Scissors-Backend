import User from "../models/user.model";
import { UserDocument } from "../types";
import CustomError from "../utils/errors";
import tokenModel from "../models/token.model";
export default class UserService {
  static async loginUser(userData: string): Promise<UserDocument | null> {
    const loginUser = await User.findOne({
      $or: [{ email: userData }, { "name.user": userData }],
    });
    return loginUser;
  }
  static async getAllUsers(): Promise<UserDocument[] | null> {
    const users = await User.find({ "accountStatus.role": "user" });
    if (!users) {
      throw new CustomError.NotFoundError("No user is found");
    }
    return users;
  }
  static async getUserByUserID(userID: string): Promise<UserDocument | null> {
    const user = await User.findOne({ userID });
    if (!user) {
      throw new CustomError.NotFoundError("User not found");
    }
    return user;
  }
  static async getUserCreate(email: string): Promise<UserDocument | null> {
    const user = await User.findOne({ email });
    return user;
  }
  static async getUserByEmail(email: string): Promise<UserDocument | null> {
    const user = await User.findOne({ email });
    return user;
  }
  static async logUserOut(userID: string): Promise<void> {
    await tokenModel.findOneAndDelete({ user: userID });
    return;
  }
  static async validateToken(
    passwordResetToken: string
  ): Promise<UserDocument> {
    const user = await User.findOne({ passwordResetToken });
    if (!user) {
      throw new CustomError.NotFoundError(
        "Password token invalid or does not exist"
      );
    }
    return user;
  }
  static async deleteUser(userID: string): Promise<void> {
    await User.deleteOne({ userID });
    return;
  }
}
