import { createUserScheme } from "./schemas/createUserScheme";
import { loginUserScheme } from "./schemas/loginUserScheme";
import { updateUserScheme } from "./schemas/updateUserScheme";
import { deleteUserScheme } from "./schemas/deleteUserScheme";
import { changeEmailScheme } from "./schemas/changeEmailScheme";
import { changePasswordScheme } from "./schemas/changePasswordScheme";
import { resetPasswordScheme } from "./schemas/resetPasswordScheme";
import { verifyPasswordScheme } from "./schemas/verifyPasswordScheme";
import { createUrlScheme } from "./schemas/createUrlScheme";
export = {
  components: {
    schemas: {
      createUserScheme,
      loginUserScheme,
      updateUserScheme,
      deleteUserScheme,
      changeEmailScheme,
      changePasswordScheme,
      resetPasswordScheme,
      verifyPasswordScheme,
      createUrlScheme,
      successResponse: {
        type: "object",
        properties: {
          status: {
            type: "string",
          },
          message: {
            type: "string",
          },
          data: {
            type: "object",
          },
        },
      },
      errorResponse: {
        type: "object",
        properties: {
          status: {
            type: "string",
          },
          message: {
            type: "string",
          },
          code: { type: "integer" },
        },
      },
      serverError: {
        type: "object",
        properties: {
          status: {
            type: "string",
          },
          message: {
            type: "string",
          },
          code: { type: "integer" },
        },
      },
    },
    securitySchemes: {
      BearerAuth: {
        type: "http",
        in: "header",
        scheme: "bearer",
        name: "Authorization",
        bearerFormat: "JWT",
      },
      CookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: "accessToken",
      },
    },
  },
};
