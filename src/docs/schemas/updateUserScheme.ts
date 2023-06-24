import ValidateUsers from "../../utils/validations/user.validation";
import joiToJSON from "joi-to-json";

export const updateUserScheme: {
  type: "object";
  title: "account";
} = joiToJSON(ValidateUsers.updateUserSchema1.extract("body"));
