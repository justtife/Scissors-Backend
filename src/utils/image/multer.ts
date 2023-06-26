import multer, { StorageEngine, Multer, FileFilterCallback } from "multer";
import CustomError from "../errors";
import { Request } from "express";
export class ImageUploader {
  private storage: StorageEngine;
  private fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback | Error | any
  ) => void;
  public upload: Multer;

  constructor() {
    this.storage = multer.diskStorage({
      filename: (req, file, cb) => {
        cb(
          null,
          file.fieldname +
            "_" +
            new Date().toISOString().replace(/:/g, "-") +
            "_" +
            file.originalname
        );
      },
    });

    this.fileFilter = (req: Request, file, cb) => {
      if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        cb(null, true);
      } else {
        cb(new CustomError.BadRequestError("Unsupported image format"), false);
      }
    };

    this.upload = multer({
      storage: this.storage,
      limits: { fileSize: 1024 * 1024 },
      fileFilter: this.fileFilter,
    });
  }
}

// export default new ImageUploader();
