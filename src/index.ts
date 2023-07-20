//Import dotenv and configure it
import * as dotenv from "dotenv";
dotenv.config();
import "express-async-errors";
import express, { Request, Response, NextFunction } from "express";
export const app = express();
import config from "./config/config";
//Security Middlewares
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import compression from "compression";
import { StatusCode } from "./types";
//Session and Cookie with storage
import session from "express-session";
import cookieParser from "cookie-parser";
import MongoStore from "connect-mongo";
//Passport Authentication
import passport from "passport";
//Initialize middlewares and security
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.disable("x-powered-by");
app.use(helmet());
app.set("trust proxy", true);
app.use(cors());
app.use(
  rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 50,
    handler: function (req: Request, res: Response, next: NextFunction) {
      errorResponse({
        res,
        message: "Too Many Requests, please try again in ten minutes",
        statusCode: StatusCode.TOO_MANY_REQUEST,
      });
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
      maxAge: 3 * 60 * 60 * 1000,
      signed: true,
      httpOnly: true,
      secure: process.env.APP_ENV === "production",
    },
    //Store sessions
    store: MongoStore.create({
      mongoUrl: config.DB_URI,
      autoRemove: "native",
      collectionName: "sessions",
      ttl: 60 * 60 * 24 * 3, //One day
    }),
  })
);
//Import middlewares
import {
  notFound,
  errorHandler,
  errorResponse,
  successResponse,
} from "./middlewares";
import { refreshToken, PassportLoad } from "./utils/auth";
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
import requestIp from "request-ip";
app.use(requestIp.mw());
//Server Test
app.get("/", async (req, res) => {
  successResponse({
    res,
    message: process.env.APP_ENV as string,
    data: {
      start: "Hello World",
      ok: req.socket.remoteAddress,
    },
  });
});
//Refresh Token
app.post("/token/refresh", async (req, res) => {
  await refreshToken(req, res);
});
//Documentation
import doc from "./docs";
import swaggerUI from "swagger-ui-express";
app.use("/docs", swaggerUI.serve, swaggerUI.setup(doc));
//Routes
import { userRouter, urlRouter } from "./routes";
app.use("/api/v1/user", userRouter);
app.use("/api/v1/url", urlRouter);
//Not Found Middleware
app.use(notFound);
//Error Handler Middleware
app.use(errorHandler);
