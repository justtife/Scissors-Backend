import { UploadApiResponse, v2 as cloudinary } from "cloudinary";
import logger from "../logger/logger";
import BadGatewayError from "../errors/badGateway";

class CloudinaryService {
  async saveImage(
    image: any,
    name: string,
    folder: string
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        image,
        { public_id: name, folder: folder },
        (err, result: any) => {
          if (err) {
            reject(
              new BadGatewayError(
                "The server encountered an issue while trying to fulfill the request. Please try again later or contact the administrator for assistance."
              )
            );
          } else {
            resolve(result);
          }
        }
      );
    });
  }

  async deleteImage(image: string): Promise<void | Error> {
    await cloudinary.uploader.destroy(image, { invalidate: true }, (error) => {
      if (error) {
        logger.error(error);
      }
    });
  }
}

export default CloudinaryService;
