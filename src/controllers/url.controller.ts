import { Request, Response } from "express";
import CustomError from "../utils/errors";
import { mainConfig } from "../config/config";
const config = mainConfig[process.env.APP_ENV as string];
import {
  StatusCode,
  UrlDocument,
  UserDocument,
  SuccessResponse,
  ErrorResponse,
  StatDocument,
} from "../types";
import { validateURL } from "../utils/helpers/validateURL";
import URLService from "../services/url.service";
import generateQRCode from "../utils/helpers/createQrCode";
import { v4 as uuidv4 } from "uuid";
import Auth from "../utils/auth/authenticateUser";
import location from "../utils/helpers/location";
const _ = require("lodash");
export default class UrlController {
  static async createShortLink(req: Request, res: Response) {
    const { original_url, tag, description, name, short_url } = req.body;
    //@ts-ignore
    let shortenTrials = req.session.shortenTrials || 0;
    const MAX_TRIALS = 3;
    await validateURL(original_url);
    let output: SuccessResponse;
    let data;
    const urlExist = await URLService.getUserUrl(short_url);
    if (urlExist) {
      throw new CustomError.BadRequestError("Url Custom name already exists");
    }
    if (req.isAuthenticated()) {
      let qrcode, short;
      if (short_url) {
        short = short_url;
      } else {
        short = uuidv4().slice(0, 6);
      }
      if (req.body.makeQR === true) {
        qrcode = await generateQRCode(`${config.APP_LINK}/${short}`, short);
      }
      let urlPayload = {
        original_url,
        tag,
        description,
        name,
        short_url: short,
        qrcode,
        //@ts-ignore
        user: req.user!.userID,
      };
      data = await URLService.createShortURL(urlPayload as UrlDocument);
      output = {
        message: "Short url created successfully",
        data:
          data !== null
            ? _.omit(Object.values(data)[1], ["user", "updatedAt", "__v"])
            : undefined,
      };
      return res.status(StatusCode.OK).json(output);
    }
    if (shortenTrials >= MAX_TRIALS) {
      return res
        .status(StatusCode.UNAUTHORIZED)
        .json({ message: "Please log in or sign up to continue" });
    }
    shortenTrials++;
    //@ts-ignore
    req.session.shortenTrials = shortenTrials;
    data = (await URLService.createShortURL(req.body)) as UrlDocument;
    output = {
      message: "Short url created successfully",
      data: `${config.APP_LINK}/${data.short_url}`,
    };
    res.status(StatusCode.OK).json(output);
  }
  static async getURL(req: Request, res: Response) {
    const { short_url } = req.params;
    let original_url = await URLService.getUrl(short_url);
    if (original_url) {
      original_url.clicks++;
    }
    const locate = await location("197.243.14.45");
    let statPayload = {
      ...locate,
      short_url,
    };
    await URLService.createStat(statPayload);
    original_url?.save();
    res.redirect(original_url?.original_url as string);
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
      `${config.APP_LINK}/${short_url}`,
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
  static async deleteShortLink(req: Request, res: Response) {
    await URLService.deleteUrl(req.params.short_url);
    const output: SuccessResponse = {
      message: "Url Successfully Deleted",
    };
    res.status(StatusCode.OK).json(output);
  }
}
