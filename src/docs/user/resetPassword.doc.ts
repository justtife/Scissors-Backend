export = {
  post: {
    // method of operation
    tags: ["Accounts"], // operation's tag.
    description: "Reset Password", // operation's desc.
    operationId: "resetPassword", // unique operation id.
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/resetPasswordScheme",
          },
        },
      },
    },
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
