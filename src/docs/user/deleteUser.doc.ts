import ValidateUsers from "../../utils/validations/user.validation";
import joiToJSON from "joi-to-json";
const userIDParams = joiToJSON(
  ValidateUsers.deleteUserAccountSchema1.extract("params")
);
export = {
  // method of operation
  tags: ["Accounts"], // operation's tag.
  description: "Delete Account", // operation's desc.
  operationId: "deleteAccount", // unique operation id.
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/deleteUserScheme",
        },
      },
    },
  },
  parameters: [
    {
      name: "userID",
      in: "path",
      required: true,
      example: userIDParams.properties.userID.default,
    },
  ], // expected params.
  // expected responses
  responses: {
    // response code
    201: {
      description: "Success response.", // response desc.
      content: {
        // content-type
        "application/json": {
          schema: {
            $ref: "#/components/schemas/successResponse", // Todo model
          },
        },
      },
    },
    400: {
      description: "Error Response", // response desc.
      content: {
        // content-type
        "application/json": {
          schema: {
            $ref: "#/components/schemas/errorResponse", // Todo model
          },
        },
      },
    },
    500: {
      description: "Server Error Response", // response desc.
      content: {
        // content-type
        "application/json": {
          schema: {
            $ref: "#/components/schemas/serverError", // Todo model
          },
        },
      },
    },
  },
};
