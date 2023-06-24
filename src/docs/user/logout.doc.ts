export = {
    // method of operation
    post: {
      tags: ["Accounts"], // operation's tag.
      description: "Log User Out", // operation's desc.
      operationId: "logOut", // unique operation id.
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
  