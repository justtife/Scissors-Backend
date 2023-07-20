import { Router } from "express";
import ValidateURLs from "../utils/validations/url.validation";
import _ from "lodash";
import UrlController from "../controllers/url.controller";
import Auth from "../utils/auth/authenticateUser";
const urlRouter = Router();
urlRouter.post(
  "/create",
  ValidateURLs.createURL,
  UrlController.createShortLink
);
urlRouter.patch(
  "/:short_url/qrcode",
  ValidateURLs.retrieveURL,
  Auth.authUser,
  UrlController.createQRCode
);
urlRouter.get(
  "/:userID/url",
  Auth.authUser,
  ValidateURLs.getSingleUserURLSchema,
  UrlController.getUsersUrl
);
urlRouter.get(
  "/:userID/qrcode",
  Auth.authUser,
  ValidateURLs.getSingleUserURLSchema,
  UrlController.getUsersQrCode
);
urlRouter.delete(
  "/:userID/:short_url/delete",
  Auth.authUser,
  ValidateURLs.deleteURL,
  UrlController.deleteShortLink
);
urlRouter.get("/:short_url", ValidateURLs.retrieveURL, UrlController.getURL);
urlRouter.get(
  "/stat/:userID",
  Auth.authUser,
  ValidateURLs.getStatData,
  UrlController.getStat
);
export default urlRouter;
