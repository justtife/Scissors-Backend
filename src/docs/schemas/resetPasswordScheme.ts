import ValidateUsers from "../../utils/validations/user.validation";
import joiToJSON from "joi-to-json";

export const resetPasswordScheme: {
  type: "object";
  title: "account";
} = joiToJSON(ValidateUsers.sendResetPasswordEmailSchema1.extract("body"));
