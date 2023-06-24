import ValidateUsers from "../../utils/validations/user.validation";
import joiToJSON from "joi-to-json";
const userIDParams = joiToJSON(
  ValidateUsers.verifyPasswordSchema1.extract("query")
);
export = {
  post: {
    // method of operation
    tags: ["Accounts"], // operation's tag.
    description: "Verify Password Token", // operation's desc.
    operationId: "verifyPassword", // unique operation id.
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/verifyPasswordScheme",
          },
        },
      },
    },
    parameters: [
      {
        in: "query",
        name: "passwordToken", // Replace with the actual parameter name
        schema: {
          type: "string", // Replace with the actual parameter type
        },
        example: userIDParams.properties.passwordToken.default,
        required: true, // Set to true if the parameter is required, false otherwise
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
