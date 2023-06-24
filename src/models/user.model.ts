import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import CustomError from "../utils/errors";
import UserDocument from "../types/user.types";
import { v4 as uuidv4 } from "uuid";

const UserSchema = new Schema<UserDocument>(
  {
    name: {
      first: String,
      last: String,
      user: { type: String },
    },
    email: {
      type: String,
      unique: true,
    },
    userID: {
      type: String,
      unique: true,
    },
    password: String,
    accountStatus: {
      role: {
        type: String,
        default: "user",
        enum: ["user", "admin", "owner"],
      },
      isActive: {
        type: Boolean,
        default: true,
      },
    },
    sex: String,
    googleID: String,
    defaultPic: String,
    profilePic: String,
    nationality: String,
    passwordResetToken: String,
    passwordResetExpiry: Date,
  },
  { timestamps: true }
);

// Hash Password before saving on every modification of the password
UserSchema.pre<UserDocument>("save", async function () {
  if (!this.isModified("password")) return;
  let salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

//Method to compare password
UserSchema.methods.isValidPassword = async function (
  password: string
): Promise<Error | boolean> {
  return await bcrypt.compare(password, this.password);
};

UserSchema.methods.sendResetPasswordMail = async function (): Promise<string> {
  const fiveMinutes = 5 * 60 * 1000;
  //Check if a token exists and if it does not expire in less than five minutes
  if (
    this.passwordResetToken &&
    this.passwordResetExpiry > new Date(Date.now() + fiveMinutes)
  ) {
    return this.passwordResetToken;
  } else {
    let resetPasswordToken = uuidv4().slice(0, 15);
    const fifteenMinutes = 15 * 60 * 1000;
    this.passwordResetToken = resetPasswordToken;
    this.passwordResetExpiry = new Date(Date.now() + fifteenMinutes);
    await this.save();
    return this.passwordResetToken;
  }
};

UserSchema.methods.validateResetPasswordToken = async function (
  resetToken: string,
  newPassword: string
) {
  //Check if the password token is the same with the one in the user's collection detail
  if (
    this.passwordResetToken === resetToken &&
    this.passwordResetExpiry > new Date(Date.now())
  ) {
    this.password = newPassword;
    this.passwordResetToken = undefined || null;
    this.passwordResetExpiry = undefined || null;
    return await this.save();
  } else {
    throw new CustomError.BadRequestError("Invalid request token");
  }
};

UserSchema.methods.makeRemoveAdmin = async function (role: string) {
  if (this.accountStatus.role === role) {
    throw new CustomError.BadRequestError(`User exist as ${role} already`);
  } else {
    this.accountStatus.role = role;
    await this.save();
  }
};
UserSchema.index({ userID: 1 }, { unique: true });
export default model<UserDocument>("User", UserSchema);
