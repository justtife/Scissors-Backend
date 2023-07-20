import { Request, Response, NextFunction } from "express";
import Joi, { ObjectSchema } from "joi";
import BadRequestError from "../errors/badRequest";
class ValidateURLs {
  //Schemas
  static createShortURLSchema1 = Joi.object({
    body: Joi.object({
      original_url: Joi.string()
        .uri()
        .pattern(/^https?:\/\//)
        .min(10)
        .max(2000)
        .required()
        .default("https://example.com")
        .error(
          new BadRequestError("Url should start with https:// or http://")
        ),
      short_url: Joi.string().min(3).max(20).default("myshorturl"),
      name: Joi.string()
        .min(3)
        .max(50)
        .required()
        .default("Testing my URL Shortner"),
      tag: Joi.array()
        .items(Joi.string().min(3).max(50))
        .default(["Shortner", "Scissors", "Finale Project"]),
      description: Joi.string()
        .min(3)
        .max(50)
        .default("Final Project-Building a URL Shortner"),
      makeQR: Joi.boolean().allow(true, false).default(false),
    }),
    query: Joi.object({}),
    params: Joi.object({}),
  });
  static retrieveURLSchema1 = Joi.object({
    body: Joi.object({}),
    query: Joi.object({}),
    params: Joi.object({
      short_url: Joi.string().min(3).max(20).required().default("myshorturl"),
    }),
  });
  static deleteURLSchema1 = Joi.object({
    body: Joi.object({}),
    query: Joi.object({}),
    params: Joi.object({
      short_url: Joi.string().min(3).max(20).required().default("myshorturl"),
      userID: Joi.string().min(7).max(7).required().default("432ba85"),
    }),
  });
  static getStat = Joi.object({
    body: Joi.object({}),
    query: Joi.object({
      skip: Joi.string().optional().default("1"),
      search: Joi.string().min(3).max(20).default("myshorturl"),
    }),
    params: Joi.object({
      userID: Joi.string().min(7).max(7).required().default("432ba85"),
    }),
  });
  static getSingleUserURLSchema1 = Joi.object({
    body: Joi.object({}),
    query: Joi.object({
      skip: Joi.string().optional().default("1"),
    }),
    params: Joi.object({
      userID: Joi.string().min(7).max(7).required().default("432ba85"),
    }),
  });
  //Validations
  static createURL(req: Request, res: Response, next: NextFunction) {
    const createShortURLSchema = ValidateURLs.createShortURLSchema1;
    return ValidateURLs.validate(createShortURLSchema)(req, res, next);
  }
  static retrieveURL(req: Request, res: Response, next: NextFunction) {
    const retrieveURLSchema = ValidateURLs.retrieveURLSchema1;
    return ValidateURLs.validate(retrieveURLSchema)(req, res, next);
  }
  static deleteURL(req: Request, res: Response, next: NextFunction) {
    const deleteURLSchema = ValidateURLs.deleteURLSchema1;
    return ValidateURLs.validate(deleteURLSchema)(req, res, next);
  }
  static getStatData(req: Request, res: Response, next: NextFunction) {
    const getStatSchema = ValidateURLs.getStat;
    return ValidateURLs.validate(getStatSchema)(req, res, next);
  }
  static getSingleUserURLSchema(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const getSingleUserURLSchema = ValidateURLs.getSingleUserURLSchema1;
    return ValidateURLs.validate(getSingleUserURLSchema)(req, res, next);
  }
  private static validate(schema: ObjectSchema) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        await schema.validateAsync({
          body: req.body,
          query: req.query,
          params: req.params,
        });
        next();
      } catch (error: any) {
        console.log(error.details);
        if (error.details && error.details.length > 0) {
          const fieldName = error.details[0].context.key;
          const errorMessage = error.details[0].message.replace(
            /^.+\"\s/,
            `${fieldName} `
          );
          throw new BadRequestError(errorMessage);
        } else {
          // Handle other error scenarios or rethrow the error
          throw error;
        }
      }
    };
  }
}
export default ValidateURLs;
