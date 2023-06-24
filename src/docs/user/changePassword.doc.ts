import ValidateUsers from "../../utils/validations/user.validation";
import joiToJSON from "joi-to-json";
const userIDParams = joiToJSON(
  ValidateUsers.changePasswordSchema1.extract("params")
);
export = {
  patch: {
    // method of operation
    tags: ["Accounts"], // operation's tag.
    description: "Change Password", // operation's desc.
    operationId: "changePassword", // unique operation id.
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/changePasswordScheme",
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
  },
};
