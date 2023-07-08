import { NextFunction, Request, Response } from "express";
import CustomError from "../utils/errors";
import { mainConfig } from "../config/config";
const config = mainConfig[process.env.APP_ENV as string];
import {
  StatusCode,
  UrlDocument,
  SuccessResponse,
  UserDocument,
} from "../types";
import Auth from "../utils/auth/authenticateUser";
import { validateURL } from "../utils/helpers/validateURL";
import URLService from "../services/url.service";
import generateQRCode from "../utils/helpers/createQrCode";
import { v4 as uuidv4 } from "uuid";
import location from "../utils/helpers/location";
import UserService from "../services/user.service";
const _ = require("lodash");
export default class UrlController {
  static async createShortLink(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { original_url, tag, description, name, short_url } = req.body;
    await validateURL(original_url);
    let output: SuccessResponse;
    let data;
    const urlExist = await URLService.getUrlByShort(short_url);
    if (urlExist) {
      throw new CustomError.BadRequestError("Url Custom name already exists");
    }
    async function checkLogIn() {
      try {
        const isAuthenticated = await Auth.authenticateJwt(req, res, next);
        return isAuthenticated;
      } catch (error) {
        console.error(error);
        return false;
      }
    }
    checkLogIn().then(async (response) => {
      if (response) {
        let qrcode, short, custom;
        if (short_url) {
          short = short_url;
          custom = true;
        } else {
          short = uuidv4().slice(0, 6);
          custom = false;
        }
        if (req.body.makeQR === true) {
          qrcode = await generateQRCode(
            `${config.FRONTEND_LINK}/${short}`,
            short
          );
        }
        let urlPayload = {
          original_url,
          tag,
          description,
          name,
          short_url: short,
          qrcode,
          custom,
          //@ts-ignore
          user: req.user!.userID,
        };
        data = await URLService.createShortURL(urlPayload as any);
        output = {
          message: "Short url created successfully",
          data:
            data !== null
              ? _.omit(Object.values(data)[1], ["user", "updatedAt", "__v"])
              : undefined,
        };
        return res.status(StatusCode.OK).json(output);
      } else {
        let urlPayload;
        if (!req.body.short_url) {
          urlPayload = { ...req.body, short_url: uuidv4().slice(0, 6) };
        } else {
          urlPayload = { ...req.body, custom: true };
        }
        data = (await URLService.createShortURL(urlPayload)) as UrlDocument;
        output = {
          message: "Short url created successfully",
          data: { short_url: data.short_url },
        };
        res.status(StatusCode.OK).json(output);
      }
    });
  }
  static async getURL(req: Request, res: Response) {
    const { short_url } = req.params;
    let original_url = await URLService.getUrl(short_url);
    if (original_url) {
      original_url.clicks++;
    }
    console.log(req.ip);
    const locate = await location("197.243.14.45");
    let statPayload = {
      ...locate,
      short_url,
    };
    await URLService.createStat(statPayload);
    original_url?.save();
    res.status(200).json(original_url?.original_url as string);
  }
  static async createQRCode(req: Request, res: Response) {
    const { short_url } = req.params;
    const original_url = await URLService.getUrl(short_url);
    let output: SuccessResponse;
    if (original_url!.qrcode) {
      output = {
        message: "QR Code generated already",
        data: original_url!.qrcode,
      };
      return res.status(StatusCode.OK).json(output);
    }
    const createQRCode = await generateQRCode(
      `${config.FRONTEND_LINK}/${short_url}`,
      short_url
    );
    await URLService.updateUrl(short_url, {
      qrcode: createQRCode,
    });
    output = {
      message: "QR Code generated succesfully",
      data: createQRCode,
    };
    res.status(StatusCode.OK).json(output);
  }
  static async getUsersUrl(req: Request, res: Response) {
    const page = Number(req.query.skip) || 1;
    const skip = (page - 1) * 5;
    const url = await URLService.getUserUrl(req.params.userID, skip);
    const user = await UserService.getUserByUserID(req.params.userID);
    await Auth.checkPermission(req.user as UserDocument, user!.userID);
    const output: SuccessResponse = {
      message: `User's URLs`,
      data: url as any,
    };
    res.status(StatusCode.OK).json(output);
  }
  static async getUsersQrCode(req: Request, res: Response) {
    const url = await URLService.getUsersQrCodes(req.params.userID);
    const user = await UserService.getUserByUserID(req.params.userID);
    await Auth.checkPermission(req.user as UserDocument, user!.userID);
    const output: SuccessResponse = {
      message: `User's Qr Codes`,
      data: url as any,
    };
    res.status(StatusCode.OK).json(output);
  }
  static async deleteShortLink(req: Request, res: Response) {
    await URLService.deleteUrl(req.params.short_url);
    const output: SuccessResponse = {
      message: "Url Successfully Deleted",
    };
    res.status(StatusCode.OK).json(output);
  }
}
