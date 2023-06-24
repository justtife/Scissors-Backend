import ValidateUsers from "../../utils/validations/user.validation";
import joiToJSON from "joi-to-json";

export const createUserScheme: {
  type: "object";
  title: "account";
} = joiToJSON(ValidateUsers.createUserSchema1.extract("body"));
