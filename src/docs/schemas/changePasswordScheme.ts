import ValidateUsers from "../../utils/validations/user.validation";
import joiToJSON from "joi-to-json";

export const changePasswordScheme: {
  type: "object";
  title: "account";
} = joiToJSON(ValidateUsers.changePasswordSchema1.extract("body"));
