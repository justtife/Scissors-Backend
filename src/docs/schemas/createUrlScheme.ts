import ValidateURLs from "../../utils/validations/url.validation";
import joiToJSON from "joi-to-json";

export const createUrlScheme: {
  type: "object";
  title: "url";
} = joiToJSON(ValidateURLs.createShortURLSchema1.extract("body"));
