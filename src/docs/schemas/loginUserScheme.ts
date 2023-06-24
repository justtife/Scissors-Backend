import ValidateUsers from "../../utils/validations/user.validation";
import joiToJSON from "joi-to-json";

export const loginUserScheme: {
  type: "object";
  title: "account";
} = joiToJSON(ValidateUsers.logUserInSchema1.extract("body"));
