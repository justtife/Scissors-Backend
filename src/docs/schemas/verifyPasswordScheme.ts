import ValidateUsers from "../../utils/validations/user.validation";
import joiToJSON from "joi-to-json";

export const verifyPasswordScheme: {
  type: "object";
  title: "account";
} = joiToJSON(ValidateUsers.verifyPasswordSchema1.extract("body"));
