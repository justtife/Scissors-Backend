import { Request, Response, NextFunction } from "express";
import Joi, { ObjectSchema } from "joi";
class ValidateURLs {
  //Schemas
  static createShortURLSchema1 = Joi.object({
    body: Joi.object({
      original_url: Joi.string()
        .uri()
        .min(10)
        .max(2000)
        .required()
        .messages({
          "any.required": "A valid URL is required",
          "string.min": "URL is not long enough",
          "string.max": "URL length should not exceed 2000 characters",
          "string.uri": "URL should start with 'http://' or 'https://'",
          "string.empty": "URL field cannot be empty, please enter a valid URL",
        })
        .default("https://example.com"),
      short_url: Joi.string()
        .min(3)
        .max(20)
        .messages({
          "string.min": "Custom name should have minimum length of 3",
          "string.max": "Custom name should not exceed 20 characters",
          "string.empty":
            "Custom name field cannot be empty, please enter a valid custom name",
        })
        .default("myshorturl"),
      name: Joi.string()
        .min(3)
        .max(50)
        .required()
        .trim()
        .messages({
          "any.required": "Please enter a title",
          "string.min": "Title field must be more than 3 letters",
          "string.max": "Title field must be less than 50 letters",
          "string.empty": "Title field cannot be empty, please enter a title",
        })
        .default("Testing my URL Shortner"),
      tag: Joi.array()
        .items(
          Joi.string().min(3).max(50).messages({
            "string.min": "Tag should be more than 2 characters long",
            "string.max": "Tag length should not exceed 50 characters",
          })
        )
        .default(["Shortner", "Scissors", "Finale Project"]),
      description: Joi.string()
        .min(3)
        .max(50)
        .trim()
        .messages({
          "string.min": "Description field must be more than 3 letters",
          "string.max": "Description field must be less than 50 letters",
        })
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
      short_url: Joi.string()
        .min(3)
        .max(20)
        .required()
        .messages({
          "any.required": "A valid short link is required",
          "string.min": "Link is not long enough",
          "string.max": "Link length has exceeded limit",
          "string.empty":
            "Link field cannot be empty, please enter a valid short link",
        })
        .default("myshorturl"),
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
  private static validate(schema: ObjectSchema) {
    return async (req: Request, res: Response, next: NextFunction) => {
      await schema.validateAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    };
  }
}
export default ValidateURLs;
