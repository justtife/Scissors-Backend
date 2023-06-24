import { UploadApiResponse, v2 as cloudinary } from "cloudinary";
import logger from "../logger/logger";
async function saveOnCloudinary(
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
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
}
export async function deleteImage(image: string): Promise<void | Error> {
  // Delete image from cloudinary
  await cloudinary.uploader.destroy(image, { invalidate: true }, (error) => {
    if (error) {
      logger.error(error);
    }
  });
}
export default saveOnCloudinary;
