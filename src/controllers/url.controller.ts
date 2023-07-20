import { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../utils/errors";
import config from "../config/config";
import { UrlDocument, SuccessResponse, UserDocument } from "../types";
import { Auth } from "../utils/auth";
import {
  validateURL,
  generateQRCode,
  location,
  CloudinaryService,
} from "../utils/helpers";
import { UserService, URLService } from "../services";
import { v4 as uuidv4 } from "uuid";
import { successResponse } from "../middlewares/outputHandler";
const _ = require("lodash");
const cloudinary = new CloudinaryService();
export default class UrlController {
  static async createShortLink(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { original_url, tag, description, name, short_url } = req.body;
    await validateURL(original_url);
    let output: SuccessResponse = {
      message: "Short url created successfully",
    };
    let data;
    const urlExist = await URLService.getUrlByShort(short_url);
    if (urlExist) {
      throw new BadRequestError("Url Custom name already exists");
    }
    Auth.checkLogIn(req, res, next).then(async (response: any) => {
      if (response) {
        let qrcode, short, custom, result: any;
        if (short_url) {
          short = short_url;
          custom = true;
        } else {
          short = uuidv4().slice(0, 6);
          custom = false;
        }
        if (req.body.makeQR === true) {
          qrcode = await generateQRCode(`${config.FRONTEND_LINK}/${short}`);
          result = await cloudinary.saveImage(
            qrcode,
            `${short_url}_code`,
            "scissors_qrcode"
          );
        }
        let urlPayload = {
          original_url,
          tag,
          description,
          name,
          short_url: short,
          qrcode: result!.secure_url as any,
          custom,
          //@ts-ignore
          user: req.user!.userID,
        };
        data = await URLService.createShortURL(urlPayload as any);
        output.data = _.omit(Object.values(data)[1], [
          "user",
          "updatedAt",
          "__v",
        ]);
      } else {
        let urlPayload;
        if (!req.body.short_url) {
          urlPayload = { ...req.body, short_url: uuidv4().slice(0, 6) };
        } else {
          urlPayload = { ...req.body, custom: true };
        }
        data = (await URLService.createShortURL(urlPayload)) as UrlDocument;
        output.data = {
          short_url: data.short_url,
          original_url: data.original_url,
          name: data.name,
        };
      }
      successResponse({ res, ...output });
    });
  }
  static async getURL(req: Request, res: Response) {
    const { short_url } = req.params;
    let original_url = await URLService.getUrl(short_url);
    if (original_url) {
      original_url.clicks++;
    }
    const locate = await location(req.ip);
    let statPayload = {
      ...locate,
      short_url,
      user: original_url!.user || "Anonymous",
    };
    await URLService.createStat(statPayload);
    original_url?.save();
    successResponse({
      res,
      message: "Original URL",
      data: original_url?.original_url as string,
    });
  }
  static async createQRCode(req: Request, res: Response) {
    const { short_url } = req.params;
    const original_url = await URLService.getUrl(short_url);
    let output: SuccessResponse = {
      message: "QR Code generated already",
    };
    if (original_url!.qrcode) {
      output.data = original_url!.qrcode;
    } else {
      const qrcode = await generateQRCode(
        `${config.FRONTEND_LINK}/${short_url}`
      );
      let result = await cloudinary.saveImage(
        qrcode,
        `${short_url}_code`,
        "scissors_qrcode"
      );
      await URLService.updateUrl(short_url, {
        qrcode: result!.secure_url,
      });
      output.data = result!.secure_url;
    }
    successResponse({
      res,
      ...output,
    });
  }
  static async getUsersUrl(req: Request, res: Response) {
    const page = Number(req.query.skip) || 1;
    const skip = (page - 1) * 5;
    const url = await URLService.getUserUrl(req.params.userID, skip);
    const user = await UserService.getUserByUserID(req.params.userID);
    await Auth.checkPermission(req.user as UserDocument, user!.userID);
    successResponse({ res, message: "User's URLs", data: url });
  }
  static async getUsersQrCode(req: Request, res: Response) {
    const page = Number(req.query.skip) || 1;
    const skip = (page - 1) * 5;
    const url = await URLService.getUsersQrCodes(req.params.userID, skip);
    const user = await UserService.getUserByUserID(req.params.userID);
    await Auth.checkPermission(req.user as UserDocument, user!.userID);
    successResponse({ res, message: "User's Qr Codes", data: url });
  }
  static async getStat(req: Request, res: Response) {
    const page = Number(req.query.skip) || 1;
    const skip = (page - 1) * 5;
    const sort = req.query.search !== undefined ? String(req.query.search) : "";
    const stat = await URLService.getStat(req.params.userID, skip, sort);
    successResponse({ res, message: "Short URL stat", data: stat });
  }
  static async deleteShortLink(req: Request, res: Response) {
    const user = await UserService.getUserByUserID(req.params.userID);
    await Auth.checkPermission(req.user as UserDocument, user!.userID);
    await URLService.deleteUrl(req.params.short_url);
    successResponse({ res, message: "Url Successfully Deleted" });
  }
}
