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
urlRouter.delete(
  "/api/v1/url/:short_url/delete",
  ValidateURLs.retrieveURL,
  UrlController.deleteShortLink
);
urlRouter.get("/:short_url", ValidateURLs.retrieveURL, UrlController.getURL);
