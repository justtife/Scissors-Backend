import ValidateUsers from "../../utils/validations/user.validation";
import joiToJSON from "joi-to-json";

export const changeEmailScheme: {
  type: "object";
  title: "account";
} = joiToJSON(ValidateUsers.changeEmailSchema1.extract("body"));
