import { Router } from "express";
import ValidateURLs from "../utils/validations/url.validation";
import _ from "lodash";
import UrlController from "../controllers/url.controller";
import Auth from "../utils/auth/authenticateUser";
export const urlRouter = Router();
urlRouter.post(
  "/api/v1/url/create",
  ValidateURLs.createURL,
  UrlController.createShortLink
);
urlRouter.patch(
  "/api/v1/url/:short_url/qrcode",
  ValidateURLs.retrieveURL,
  Auth.authUser,
  UrlController.createQRCode
);
urlRouter.get(
  "/api/v1/url/:userID/url",
  Auth.authUser,
  ValidateURLs.getSingleUserURLSchema,
  UrlController.getUsersUrl
);
urlRouter.get(
  "/api/v1/url/:userID/qrcode",
  Auth.authUser,
  ValidateURLs.getSingleUserURLSchema,
  UrlController.getUsersQrCode
);
urlRouter.delete(
  "/api/v1/url/:short_url/delete",
  ValidateURLs.retrieveURL,
  UrlController.deleteShortLink
);
urlRouter.get(
  "/api/v1/url/:short_url",
  ValidateURLs.retrieveURL,
  UrlController.getURL
);
