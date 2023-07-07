//Import dotenv and configure it
import * as dotenv from "dotenv";
dotenv.config();
//Import express async errors to handle async errors
import "express-async-errors";

import express, { Request, Response, NextFunction } from "express";
export const app = express();
import { mainConfig } from "./config/config";
const config = mainConfig[<string>process.env.APP_ENV];

//Security Middlewares
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import compression from "compression";
import { StatusCode, SuccessResponse, ErrorResponse } from "./types";
//Session and Cookie with storage
import session from "express-session";
import cookieParser from "cookie-parser";
import MongoStore from "connect-mongo";

//Passport Authentication
import passport from "passport";
import PassportLoad from "./utils/auth/passport";

//Initialize middlewares and security
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.disable("x-powered-by");
app.use(helmet());
app.set("trust proxy", 1);
app.use(cors());
app.use(
  rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 50,
    handler: function (req: Request, res: Response, next: NextFunction) {
      const output: ErrorResponse = {
        message: "Too Many Request, try again after ten minute",
        status: "failed",
      };
      res.status(StatusCode.TOO_MANY_REQUEST).json(output);
    },
  })
);
app.use(compression());

//Initialize session and cookie parser
app.use(cookieParser(config.JWT_SECRET));

app.use(
  session({
    name: config.SESSION_NAME,
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 60 * 60 * 1000,
      signed: true,
      httpOnly: true,
      secure: process.env.APP_ENV === "production",
    },
    //Store sessions
    store: MongoStore.create({
      mongoUrl: config.DB_URI,
      autoRemove: "native",
      collectionName: "sessions",
      ttl: 60 * 60 * 24 * 1, //One day
    }),
  })
);

//Configure and Initialize Passport
app.use(passport.initialize());
app.use(passport.session());
PassportLoad(passport);

//Cloudinary configuration
import "./config/cloudinary";

// Logger
import log from "./utils/logger/log";

//Log every requests with status and statusCode
app.use(log);

import CustomError from "./utils/errors";
//Server Test
import requestIp from "request-ip";
app.use(requestIp.mw());
app.get("/", async (req, res) => {
  const output: SuccessResponse = {
    message: process.env.APP_ENV as string,
    data: {
      start: "Hello World",
    },
  };
  res.status(200).json(output);
});
import refreshToken from "./utils/auth/refreshToken";
//Refresh Token
app.post("/token/refresh", async (req, res) => {
  await refreshToken(req, res);
});
//Error Test
app.get("/error", (req, res) => {
  throw new CustomError.BadRequestError("This is a test error");
});

//Documentation
import joiToJSON from "joi-to-json";
import UserValidation from "./utils/validations/user.validation";
import doc from "./docs";
import swaggerUI from "swagger-ui-express";

//Authentication
import { token as createToken } from "./utils/auth/createToken";
import _ from "lodash";
app.get("/doc", (req, res) => {
  const test = UserValidation.logUserInSchema1;
  let ans = joiToJSON(test.extract("body"));
  res.status(200).json(ans);
});

app.use("/docs", swaggerUI.serve, swaggerUI.setup(doc));

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })
);
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth/google" }),
  (req: Request, res: Response, next: NextFunction) => {
    let user: any = req.user;
    req.logIn(user, async (err) => {
      if (err) {
        return next(err);
      }
      let token = await createToken({ req, res, user });
      const output: SuccessResponse = {
        status: "success",
        message: "Signin successful",
        token,
        data: _.omit(Object.values(req.user as object)[2], [
          "password",
          "accountStatus.isActive",
          "nationality",
          "passwordResetToken",
          "passwordResetExpiry",
          "updatedAt",
          "__v",
        ]),
      };
      return res.status(StatusCode.OK).json(output);
    });
  }
);
//Routes
import { userRouter } from "./routes/user.route";
import { urlRouter } from "./routes/url.route";
app.use("/api/v1/user", userRouter);
app.use("", urlRouter);

//Import middlewares
import notFound from "./middlewares/notFound";
import errorHandler from "./middlewares/errorHandler";
//Not Found Middleware
app.use(notFound);
//Error Handler Middleware
app.use(errorHandler);
