import Url from "../models/url.model";
import Stat from "../models/stat.model";
import { UrlDocument, StatDocument } from "../types";
import CustomError from "../utils/errors";
import _ from "lodash";
import NotFoundError from "../utils/errors/notFound";
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
  static async getUserUrl(
    userID: string,
    paginate: number
  ): Promise<{
    urls: UrlDocument[] | null;
    totalUrls: UrlDocument[];
    count: number;
    totalClicks: number;
    totalCustomField: number;
  } | null> {
    const [urls, totalUrls, count, totalClicks, totalCustomField] =
      await Promise.all([
        Url.find({ user: userID })
          .sort({ createdAt: -1 })
          .skip(paginate)
          .limit(5),
        Url.find({ user: userID }),
        Url.countDocuments({ user: userID }),
        Url.aggregate([
          { $match: { user: userID } },
          { $group: { _id: null, totalClicks: { $sum: "$clicks" } } },
        ]),
        Url.countDocuments({ user: userID, custom: true }),
      ]);

    if (urls.length < 1) {
      throw new CustomError.NotFoundError("No URLs were found");
    }

    const totalClicksValue =
      totalClicks.length > 0 ? totalClicks[0].totalClicks : 0;

    return {
      urls,
      totalUrls,
      count,
      totalClicks: totalClicksValue,
      totalCustomField,
    };
  }

  static async getUsersQrCodes(
    userID: string,
    paginate: number
  ): Promise<{
    urls: UrlDocument[] | null;
    count: number;
  } | null> {
    const [urls, count] = await Promise.all([
      Url.find({ $and: [{ user: userID }, { qrcode: { $ne: null } }] })
        .sort({ createdAt: -1 })
        .skip(paginate)
        .limit(5),
      Url.countDocuments({
        $and: [{ user: userID }, { qrcode: { $ne: null } }],
      }),
    ]);

    if (urls.length < 1) {
      throw new CustomError.NotFoundError("No URLs were found");
    }

    return { urls, count };
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
  static async getStat(
    userID: string,
    paginate: number,
    sort?: string
  ): Promise<StatDocument[] | null> {
    let statResult;
    let query = Stat.find({ user: userID }).skip(paginate).limit(5);
    if (sort && sort.length > 5) {
      query.where({ short_url: sort });
    }
    query.sort({ createdAt: -1 });
    const statData = await query.exec();
    if (!statData) {
      throw new NotFoundError("Url has not been clicked");
    } else {
      statResult = statData;
    }
    return statResult;
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
