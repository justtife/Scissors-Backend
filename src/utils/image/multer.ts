import multer, { StorageEngine, Multer, FileFilterCallback } from "multer";
import { Request, Response, NextFunction } from "express";
import BadRequestError from "../errors/badRequest";
import UnsupportedMediaTypeError from "../errors/unSupportedMediaType";
export class ImageUploader {
  private storage: StorageEngine;
  private fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback | Error | any
  ) => void;
  private upload: Multer;
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
        cb(new UnsupportedMediaTypeError("Unsupported image format"), false);
      }
    };
    this.upload = multer({
      storage: this.storage,
      limits: { fileSize: 1024 * 1024 },
      fileFilter: this.fileFilter,
    });
  }
  public uploadErrorHandlerMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    this.upload.single("profilePic")(req, res, (error: any) => {
      if (error instanceof multer.MulterError) {
        if (error.code === "LIMIT_FILE_SIZE") {
          // Handle file size limit exceeded error
          next(new BadRequestError("File size limit exceeded"));
          return;
        }
      }
      next(error);
    });
  }
}
