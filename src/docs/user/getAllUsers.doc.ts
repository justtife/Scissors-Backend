export = {
  // method of operation
  get: {
    tags: ["Accounts"], // operation's tag.
    description: "Get All Users", // operation's desc.
    operationId: "getAllAccount", // unique operation id.
    security: [ // Define the security requirements
      {
        bearerAuth: [],// Specify the security scheme (e.g., Bearer token)
        CookieAuth: [], 
      },
    ],
    parameters: [], // expected params.

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
