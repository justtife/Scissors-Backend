import User from "../models/user.model";
import { UserDocument, UserQuery } from "../types";
import {
  BadRequestError,
  DuplicateError,
  NotFoundError,
} from "../utils/errors";
import tokenModel from "../models/token.model";
import { v4 as uuidv4 } from "uuid";
import { generateDefaultProfilePic } from "../utils/helpers/defaultProfilePic";
import saveOnCloudinary from "../utils/helpers/cloudinary";
export default class UserService {
  static async createUser(userDetail: any): Promise<UserDocument | any> {
    const user = await UserService.getUserByEmail(userDetail.email);
    if (user) {
      throw new DuplicateError(
        "User with email exist, please signup with a new mail"
      );
    }
    let newUser = new User();
    newUser.name = {
      first: userDetail.firstname || userDetail.given_name,
      last: userDetail.lastname || userDetail.family_name,
      user: userDetail.username || userDetail.email,
    };
    newUser.email = userDetail.email;
    newUser.password = userDetail.password;
    newUser.sex = userDetail.sex;
    newUser.nationality = userDetail.nationality;
    newUser.userID = uuidv4().slice(0, 7);
    newUser.profilePic =
      userDetail.profilePic || userDetail.photos?.[0]?.value || null;
    let name =
      (userDetail.firstname || userDetail.given_name) +
      " " +
      (userDetail.lastname || userDetail.family_name);
    let image = generateDefaultProfilePic(name);
    const saveImage = await saveOnCloudinary(
      image,
      `default_${userDetail.email}`,
      "scissors_user"
    );
    newUser.defaultPic = saveImage.secure_url;
    return newUser.save();
  }
  static async loginUser(userData: string): Promise<UserDocument | null> {
    const loginUser = await User.findOne({
      $or: [{ email: userData }, { "name.user": userData }],
    });
    return loginUser;
  }
  static async getAllUsers(
    { search, role, is_active }: UserQuery,
    paginate: number
  ): Promise<{
    users: UserDocument[] | null;
    count: number;
  } | null> {
    let query: any = {};
    switch (true) {
      case !!role:
        query["accountStatus.role"] = role;
        break;
      case !!is_active:
        query["accountStatus.isActive"] = is_active;
        break;
      default:
        query["accountStatus.role"] = "user";
        break;
    }
    const usersQuery = {
      $or: [
        { email: { $regex: search, $options: "i" } },
        { userID: { $regex: search, $options: "i" } },
        { "name.user": { $regex: search, $options: "i" } },
      ],
    };
    const findQuery = search ? usersQuery : query;
    const [users, count] = await Promise.all([
      User.find(findQuery).skip(paginate).limit(10),
      User.countDocuments(),
    ]);
    if (users.length < 1) {
      throw new NotFoundError("No user found");
    }
    return { users, count };
  }
  static async getUserByUserID(userID: string): Promise<UserDocument | null> {
    const user = await User.findOne({ userID });
    if (!user) {
      throw new NotFoundError("User not found");
    }
    return user;
  }

  static async getUserByEmail(email: string): Promise<UserDocument | null> {
    const user = await User.findOne({ email });
    return user;
  }
  static async logUserOut(userID: string): Promise<void> {
    const token = await tokenModel.findOneAndDelete({ user: userID });
    if (!token) {
      throw new BadRequestError("No device logged in");
    }
    return;
  }
  static async validateToken(
    passwordResetToken: string
  ): Promise<UserDocument> {
    const user = await User.findOne({ passwordResetToken });
    if (!user) {
      throw new NotFoundError("Password token invalid or does not exist");
    }
    return user;
  }
  static async deleteUser(userID: string): Promise<void> {
    await User.deleteOne({ userID });
    return;
  }
}
