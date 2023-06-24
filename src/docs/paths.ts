import createUserDoc from "./user/createUser.doc";
import logUserInDoc from "./user/logUserIn.doc";
import getAllUsersDoc from "./user/getAllUsers.doc";
import getUserDoc from "./user/getUser.doc";
import updateUserDoc from "./user/updateUser.doc";
import deleteUserDoc from "./user/deleteUser.doc";
import changeEmailDoc from "./user/changeEmail.doc";
import changePasswordDoc from "./user/changePassword.doc";
import resetPasswordDoc = require("./user/resetPassword.doc");
import verifyPasswordDoc = require("./user/verifyPassword.doc");
import logoutDoc = require("./user/logout.doc");
import createUrlDoc = require("./url/createUrl.doc");
import retrieveUrlDoc = require("./url/retrieveUrl.doc");
export = {
  paths: {
    "/api/v1/user/signup": createUserDoc,
    "/api/v1/user/login": logUserInDoc,
    "/api/v1/user/users": getAllUsersDoc,
    "/api/v1/user/{userID}": {
      get: getUserDoc,
      patch: updateUserDoc,
      delete: deleteUserDoc,
    },
    "/api/v1/user/change-email": changeEmailDoc,
    "/api/v1/user/{userID}/change-password": changePasswordDoc,
    "/api/v1/user/reset-password": resetPasswordDoc,
    "/api/v1/user/password/verify": verifyPasswordDoc,
    "/api/v1/user/logout": logoutDoc,
    "/api/v1/url/create": createUrlDoc,
    "/{short_url}": retrieveUrlDoc,
  },
};
