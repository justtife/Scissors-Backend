import { Request, Response, NextFunction } from "express";
import Joi, { ObjectSchema } from "joi";
import { BadRequestError } from "../errors";
class ValidateUsers {
  //Schemas
  static createUserSchema1 = Joi.object({
    body: Joi.object({
      firstname: Joi.string().min(3).max(50).default("John").required(),
      lastname: Joi.string().min(3).max(50).required().default("doe"),
      username: Joi.string().min(3).max(50).required().default("John Doe"),
      email: Joi.string().email().required().default("johndoe@email.com"),
      sex: Joi.string().valid("male", "female", "others"),
      profilePic: Joi.string(),
      nationality: Joi.string().min(3).max(30).default("Nigerian"),
      password: Joi.string()
        .min(6)
        .pattern(new RegExp(/^[a-zA-Z0-9!@#$%&*]{3,25}$/))
        .required()
        .default("Passcode"),
      repeat_password: Joi.string()
        .required()
        .equal(Joi.ref("password"))
        .default("Passcode")
        .messages({
          "any.only": "Passwords do not match",
        }),
    }).with("password", "repeat_password"),
    query: Joi.object({}),
    params: Joi.object({}),
  });
  static logUserInSchema1 = Joi.object({
    body: Joi.object({
      user: Joi.alternatives([Joi.string(), Joi.string().email()])
        .default("johndoe@email.com")
        .required(),
      password: Joi.string()
        .min(6)
        .pattern(new RegExp(/^[a-zA-Z0-9!@#$%&*]{3,25}$/))
        .required()
        .default("Passcode"),
    }),
    query: Joi.object({}),
    params: Joi.object({}),
  });
  static getSingleUserSchema1 = Joi.object({
    body: Joi.object({}),
    query: Joi.object({}),
    params: Joi.object({
      userID: Joi.string().min(7).max(7).required().default("432ba85"),
    }),
  });
  static getAllUsersSchema1 = Joi.object({
    body: Joi.object({}),
    query: Joi.object({
      search: Joi.alternatives([Joi.string(), Joi.string().email()]).default(
        "johndoe@email.com"
      ),
      skip: Joi.string().default("1"),
      role: Joi.string().valid("user", "admin", "owner").default("user"),
      is_active: Joi.boolean(),
    }),
    params: Joi.object({}),
  });
  static updateUserSchema1 = Joi.object({
    body: Joi.object({
      firstname: Joi.string().min(3).max(50).required().default("Jane"),
      profilePic: Joi.string(),
      lastname: Joi.string().min(3).max(50).required().default("Smith"),
      username: Joi.string().min(3).max(50).required().default("Jane Smith"),
      sex: Joi.string().valid("male", "female", "others").default("female"),
      nationality: Joi.string().min(3).max(30).default("British"),
    }),
    query: Joi.object({}),
    params: Joi.object({
      userID: Joi.string().min(7).max(7).required().default("432ba85"),
    }),
  });
  static deleteUserAccountSchema1 = Joi.object({
    body: Joi.object({
      password: Joi.string()
        .min(6)
        .pattern(new RegExp(/^[a-zA-Z0-9!@#$%&*]{3,25}$/))
        .required()
        .default("Passcode"),
    }),
    query: Joi.object({}),
    params: Joi.object({
      userID: Joi.string().min(7).max(7).required().default("432ba85"),
    }),
  });
  static changeEmailSchema1 = Joi.object({
    body: Joi.object({
      oldEmail: Joi.string().email().required().default("johndoe@email.com"),
      newEmail: Joi.string().email().required().default("janesmith@email.com"),
    }),
    query: Joi.object({}),
    params: Joi.object({}),
  });
  static changePasswordSchema1 = Joi.object({
    body: Joi.object({
      oldPassword: Joi.string()
        .min(6)
        .pattern(new RegExp(/^[a-zA-Z0-9!@#$%&*]{3,25}$/))
        .required()
        .default("Passcode"),
      newPassword: Joi.string()
        .min(6)
        .pattern(new RegExp(/^[a-zA-Z0-9!@#$%&*]{3,25}$/))
        .required()
        .default("Password1234"),
    }),
    query: Joi.object({}),
    params: Joi.object({
      userID: Joi.string().min(7).max(7).required().default("432ba85"),
    }),
  });
  static sendResetPasswordEmailSchema1 = Joi.object({
    body: Joi.object({
      email: Joi.string().email().required().default("janesmith@email.com"),
    }),
    query: Joi.object({}),
    params: Joi.object({}),
  });
  static verifyPasswordSchema1 = Joi.object({
    body: Joi.object({
      newPassword: Joi.string()
        .min(6)
        .pattern(new RegExp(/^[a-zA-Z0-9!@#$%&*]{3,25}$/))
        .required()
        .default("MyPassword1234"),
      repeat_password: Joi.string()
        .required()
        .equal(Joi.ref("newPassword"))
        .default("MyPassword1234"),
    }).with("newPassword", "repeat_password"),
    query: Joi.object({
      passwordToken: Joi.string()
        .min(15)
        .max(15)
        .required()
        .default("b0243e59-ed5d-4"),
    }),
    params: Joi.object({}),
  });
  //Validations
  static createUser(req: Request, res: Response, next: NextFunction) {
    const createUserSchema = ValidateUsers.createUserSchema1;
    return ValidateUsers.validate(createUserSchema)(req, res, next);
  }
  static loginUser(req: Request, res: Response, next: NextFunction) {
    const logUserInSchema = ValidateUsers.logUserInSchema1;
    return ValidateUsers.validate(logUserInSchema)(req, res, next);
  }
  static getSingleUser(req: Request, res: Response, next: NextFunction) {
    const getSingleUserSchema = ValidateUsers.getSingleUserSchema1;
    return ValidateUsers.validate(getSingleUserSchema)(req, res, next);
  }
  static getAllUsers(req: Request, res: Response, next: NextFunction) {
    const getAllUsersSchema = ValidateUsers.getAllUsersSchema1;
    return ValidateUsers.validate(getAllUsersSchema)(req, res, next);
  }
  static deleteUserAccount(req: Request, res: Response, next: NextFunction) {
    const deleteUserAccountSchema = ValidateUsers.deleteUserAccountSchema1;
    return ValidateUsers.validate(deleteUserAccountSchema)(req, res, next);
  }
  static updateUser(req: Request, res: Response, next: NextFunction) {
    const updateUserSchema = ValidateUsers.updateUserSchema1;
    return ValidateUsers.validate(updateUserSchema)(req, res, next);
  }
  static changeEmail(req: Request, res: Response, next: NextFunction) {
    const changeEmailSchema = ValidateUsers.changeEmailSchema1;
    return ValidateUsers.validate(changeEmailSchema)(req, res, next);
  }
  static sendResetPasswordEmail(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const sendResetPasswordEmailSchema =
      ValidateUsers.sendResetPasswordEmailSchema1;
    return ValidateUsers.validate(sendResetPasswordEmailSchema)(req, res, next);
  }
  static changePassword(req: Request, res: Response, next: NextFunction) {
    const changePasswordSchema = ValidateUsers.changePasswordSchema1;
    return ValidateUsers.validate(changePasswordSchema)(req, res, next);
  }
  static verifyPassword(req: Request, res: Response, next: NextFunction) {
    const verifyPasswordSchema = ValidateUsers.verifyPasswordSchema1;
    return ValidateUsers.validate(verifyPasswordSchema)(req, res, next);
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
        const fieldName = error.details[0].context.key;
        const errorMessage = error.details[0].message.replace(
          /^.+\"\s/,
          `${fieldName} `
        );
        throw new BadRequestError(errorMessage);
      }
    };
  }
}
export default ValidateUsers;
