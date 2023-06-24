export = {
  // method of operation
  post: {
    tags: ["URLs"], // operation's tag.
    description: "Create Short URL", // operation's desc.
    operationId: "createUrl", // unique operation id.
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/createUrlScheme",
          },
        },
      },
    },
    security: [
      // Define the security requirements
      {
        bearerAuth: [], // Specify the security scheme (e.g., Bearer token)
        CookieAuth: [],
      },
    ],
    parameters: [], // expected params.
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
