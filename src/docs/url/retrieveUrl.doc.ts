import ValidateURLs from "../../utils/validations/url.validation";
import joiToJSON from "joi-to-json";
const urlParams = joiToJSON(ValidateURLs.retrieveURLSchema1.extract("params"));
export = {
  get: {
    // method of operation
    tags: ["URLs"], // operation's tag.
    description: "Retrieve Original URL", // operation's desc.
    operationId: "retrieveUrl", // unique operation id.
    security: [
      // Define the security requirements
      {
        bearerAuth: [], // Specify the security scheme (e.g., Bearer token)
        CookieAuth: [],
      },
    ],
    parameters: [
      {
        name: "short_url",
        in: "path",
        required: true,
        example: urlParams.properties.short_url.default,
      },
    ], // expected params.

    // expected responses
    responses: {
      // response code
      200: {
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
