import ValidateUsers from "../../utils/validations/user.validation";
import joiToJSON from "joi-to-json";

export const deleteUserScheme: {
  type: "object";
  title: "account";
} = joiToJSON(ValidateUsers.deleteUserAccountSchema1.extract("body"));
