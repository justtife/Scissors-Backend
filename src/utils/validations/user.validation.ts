import { Request, Response, NextFunction } from "express";
import Joi, { ObjectSchema } from "joi";
import BadRequestError from "../errors/badRequest";
class ValidateUsers {
  //Schemas
  static createUserSchema1 = Joi.object({
    body: Joi.object({
      firstname: Joi.string()
        .min(3)
        .max(50)
        .trim()
        .messages({
          "any.required": "Firstname is required",
          "string.min": "Firstname field must be more than 3 letters",
          "string.max": "Firstname field must be less than 50 letters",
          "string.empty":
            "Firstname field cannot be empty, please enter firstname",
        })
        .default("John")
        .required(),
      lastname: Joi.string()
        .min(3)
        .max(50)
        .required()
        .trim()
        .messages({
          "any.required": "Lastname is required",
          "string.min": "Lastname field must be more than 3 letters",
          "string.max": "Lastname field must be less than 50 letters",
          "string.empty":
            "Lastname field cannot be empty, please enter lastname",
        })
        .default("doe"),
      username: Joi.string()
        .min(3)
        .max(50)
        .required()
        .trim()
        .messages({
          "any.required": "Username is required",
          "string.min": "Username field must be more than 3 letters",
          "string.max": "Username field must be less than 50 letters",
          "string.empty":
            "Username field cannot be empty, please enter username",
        })
        .default("John Doe"),
      email: Joi.string()
        .email({ minDomainSegments: 2 })
        .required()
        .messages({
          "any.required": "Email is required",
          "string.empty":
            "Email field cannot be empty, please enter a valid email",
          "string.email": "Enter a valid email",
        })
        .default("johndoe@email.com"),
      sex: Joi.string()
        .valid("male", "female", "others")
        .error(
          new BadRequestError("Value for sex can only be male/female/others")
        ),
      profilePic: Joi.string(),
      nationality: Joi.string()
        .min(3)
        .max(30)
        .error(
          new BadRequestError(
            "Nationality value should have a value beteween 3 and 30"
          )
        )
        .default("Nigerian"),
      password: Joi.string()
        .min(6)
        .trim()
        .pattern(new RegExp(/^[a-zA-Z0-9!@#$%&*]{3,25}$/))
        .required()
        .messages({
          "any.required": "Password is required",
          "string.min": "Password field must be more than 6 characters",
          "string.empty": `Password field cannot be empty, please enter password`,
          "string.pattern.base": ` Password can only contain alphanumeric including !,@,#,$,%,&,*`,
        })
        .default("Passcode"),
      repeat_password: Joi.string()
        .required()
        .equal(Joi.ref("password"))
        .messages({
          "any.required": "Repeat password field is required",
          "any.only": "Passwords do not match",
        })
        .default("Passcode"),
    }).with("password", "repeat_password"),
    query: Joi.object({}),
    params: Joi.object({}),
  });
  static logUserInSchema1 = Joi.object({
    body: Joi.object({
      user: Joi.alternatives([
        Joi.string(),
        Joi.string().email({ minDomainSegments: 2 }),
      ])
        .default("johndoe@email.com")
        .required()
        .error(new BadRequestError("Enter a valid username or email")),
      password: Joi.string()
        .min(6)
        .trim()
        .pattern(new RegExp(/^[a-zA-Z0-9!@#$%&*]{3,25}$/))
        .required()
        .default("Passcode")
        .error(new BadRequestError("Enter a valid Password")),
    }),
    query: Joi.object({}),
    params: Joi.object({}),
  });
  static getSingleUserSchema1 = Joi.object({
    body: Joi.object({}),
    query: Joi.object({}),
    params: Joi.object({
      userID: Joi.string()
        .min(7)
        .max(7)
        .required()
        .trim()
        .messages({
          "any.required": "User ID is required",
          "string.min": "User ID must be 7 letters",
          "string.max": "User ID must be 7 letters",
        })
        .default("432ba85"),
    }),
  });
  static updateUserSchema1 = Joi.object({
    body: Joi.object({
      firstname: Joi.string()
        .min(3)
        .max(50)
        .required()
        .trim()
        .messages({
          "any.required": "Firstname is required",
          "string.min": "Firstname field must be more than 3 letters",
          "string.max": "Firstname field must be less than 50 letters",
          "string.empty":
            "Firstname field cannot be empty, please enter firstname",
        })
        .default("Jane"),
      lastname: Joi.string()
        .min(3)
        .max(50)
        .required()
        .trim()
        .messages({
          "any.required": "Lastname is required",
          "string.min": "Lastname field must be more than 3 letters",
          "string.max": "Lastname field must be less than 50 letters",
          "string.empty":
            "Lastname field cannot be empty, please enter lastname",
        })
        .default("Smith"),
      username: Joi.string()
        .min(3)
        .max(50)
        .required()
        .trim()
        .messages({
          "any.required": "Username is required",
          "string.min": "Username field must be more than 3 letters",
          "string.max": "Username field must be less than 50 letters",
          "string.empty":
            "Username field cannot be empty, please enter username",
        })
        .default("Jane Smith"),
      sex: Joi.string()
        .valid("male", "female", "others")
        .error(
          new BadRequestError("Value for sex can only be male/female/others")
        )
        .default("female"),
      nationality: Joi.string()
        .min(3)
        .max(30)
        .error(
          new BadRequestError(
            "Nationality value should have a value beteween 3 and 30"
          )
        )
        .default("British"),
    }),
    query: Joi.object({}),
    params: Joi.object({
      userID: Joi.string()
        .min(7)
        .max(7)
        .required()
        .trim()
        .messages({
          "any.required": "User ID is required",
          "string.min": "User ID must be 7 letters",
          "string.max": "User ID must be 7 letters",
        })
        .default("432ba85"),
    }),
  });
  static deleteUserAccountSchema1 = Joi.object({
    body: Joi.object({
      password: Joi.string()
        .min(6)
        .trim()
        .pattern(new RegExp(/^[a-zA-Z0-9!@#$%&*]{3,25}$/))
        .required()
        .messages({
          "any.required": "Password is required",
          "string.min": "Password field must be more than 6 characters",
          "string.empty": `Password field cannot be empty, please enter password`,
          "string.pattern.base": ` Password can only contain alphanumeric including !,@,#,$,%,&,*`,
        })
        .default("Passcode"),
    }),
    query: Joi.object({}),
    params: Joi.object({
      userID: Joi.string()
        .min(7)
        .max(7)
        .required()
        .trim()
        .messages({
          "any.required": "User ID is required",
          "string.min": "User ID must be 7 letters",
          "string.max": "User ID must be 7 letters",
        })
        .default("432ba85"),
    }),
  });
  static changeEmailSchema1 = Joi.object({
    body: Joi.object({
      oldEmail: Joi.string()
        .email({ minDomainSegments: 2 })
        .required()
        .messages({
          "any.required": "Old email is required",
          "string.empty":
            "Email field cannot be empty, please enter a valid email",
          "string.email": "Enter a valid email",
        })
        .default("johndoe@email.com"),
      newEmail: Joi.string()
        .email({ minDomainSegments: 2 })
        .required()
        .messages({
          "any.required": "A new email is required",
          "string.empty":
            "Email field cannot be empty, please enter a valid email",
          "string.email": "Enter a valid email",
        })
        .default("janesmith@email.com"),
    }),
    query: Joi.object({}),
    params: Joi.object({}),
  });
  static changePasswordSchema1 = Joi.object({
    body: Joi.object({
      oldPassword: Joi.string()
        .min(6)
        .trim()
        .pattern(new RegExp(/^[a-zA-Z0-9!@#$%&*]{3,25}$/))
        .required()
        .messages({
          "any.required": "Old Password is required",
          "string.min": "Password field must be more than 6 characters",
          "string.empty": `Password field cannot be empty, please enter password`,
          "string.pattern.base": ` Password can only contain alphanumeric including !,@,#,$,%,&,*`,
        })
        .default("Passcode"),
      newPassword: Joi.string()
        .min(6)
        .trim()
        .pattern(new RegExp(/^[a-zA-Z0-9!@#$%&*]{3,25}$/))
        .required()
        .messages({
          "any.required": "New Password is required",
          "string.min": "Password field must be more than 6 characters",
          "string.empty": `Password field cannot be empty, please enter password`,
          "string.pattern.base": ` Password can only contain alphanumeric including !,@,#,$,%,&,*`,
        })
        .default("Password1234"),
    }),
    query: Joi.object({}),
    params: Joi.object({
      userID: Joi.string()
        .min(7)
        .max(7)
        .required()
        .trim()
        .messages({
          "any.required": "User ID is required",
          "string.min": "User ID must be 7 letters",
          "string.max": "User ID must be 7 letters",
        })
        .default("432ba85"),
    }),
  });
  static sendResetPasswordEmailSchema1 = Joi.object({
    body: Joi.object({
      email: Joi.string()
        .email({ minDomainSegments: 2 })
        .required()
        .messages({
          "any.required": "Email is required",
          "string.empty":
            "Email field cannot be empty, please enter a valid email",
          "string.email": "Enter a valid email",
        })
        .default("janesmith@email.com"),
    }),
    query: Joi.object({}),
    params: Joi.object({}),
  });
  static verifyPasswordSchema1 = Joi.object({
    body: Joi.object({
      newPassword: Joi.string()
        .min(6)
        .trim()
        .pattern(new RegExp(/^[a-zA-Z0-9!@#$%&*]{3,25}$/))
        .required()
        .messages({
          "any.required": "Password is required",
          "string.min": "Password field must be more than 6 characters",
          "string.empty": `Password field cannot be empty, please enter password`,
          "string.pattern.base": ` Password can only contain alphanumeric including !,@,#,$,%,&,*`,
        })
        .default("MyPassword1234"),
      repeat_password: Joi.string()
        .required()
        .equal(Joi.ref("newPassword"))
        .messages({
          "any.required": "Repeat password field is required",
          "any.only": "Passwords do not match",
        })
        .default("MyPassword1234"),
    }).with("newPassword", "repeat_password"),
    query: Joi.object({
      passwordToken: Joi.string()
        .min(15)
        .max(15)
        .required()
        .trim()
        .messages({
          "any.required": "Password token is invalid",
          "string.min": "Password token is invalid",
          "string.max": "Password token is invalid",
        })
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
      await schema.validateAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    };
  }
}
export default ValidateUsers;
