import Url from "../models/url.model";
import Stat from "../models/stat.model";
import { UrlDocument, StatDocument } from "../types";
import CustomError from "../utils/errors";
import _ from "lodash";
export default class URLService {
  static async createShortURL(
    payload: UrlDocument
  ): Promise<UrlDocument | Error> {
    try {
      const createdData = await Url.create(payload);
      return createdData;
    } catch (err) {
      throw err;
    }
  }
  static async getUrl(link: string): Promise<UrlDocument | null> {
    const url = await Url.findOne({
      short_url: link,
    });
    if (!url) {
      throw new CustomError.NotFoundError("Short url does not exists");
    }
    return url;
  }
  static async getUrlByShort(link: string): Promise<UrlDocument | null> {
    const url = await Url.findOne({ short_url: link });
    return url;
  }
  static async getUserUrl(userID: string): Promise<UrlDocument[] | null> {
    const url = await Url.find({ user: userID });
    if (url.length < 1) {
      throw new CustomError.NotFoundError("Not url was found");
    }
    return url;
  }
  static async getUsersQrCodes(userID: string): Promise<UrlDocument[] | null> {
    const url = await Url.find({
      $and: [{ user: userID }, { qrcode: { $ne: null } }],
    });
    if (!url) {
      throw new CustomError.NotFoundError("No QR code has been generated");
    }
    return url;
  }
  static async updateUrl(
    link: string,
    payload: UrlDocument | any
  ): Promise<UrlDocument | any> {
    const updateLink = await Url.updateOne({ short_url: link }, payload);
    return updateLink;
  }
  static async createStat(data: any): Promise<StatDocument | null> {
    const stat = await Stat.create(data);
    return stat;
  }
  static async deleteUrl(link: string): Promise<void> {
    const short_url = await Url.findOneAndDelete({ short_url: link });
    if (!short_url) {
      throw new CustomError.NotFoundError("Url does not exist");
    }
    const stat = await Stat.find({ short_url: link });
    if (stat) {
      await Stat.deleteMany({ short_url: link });
    }
    return;
  }
}
