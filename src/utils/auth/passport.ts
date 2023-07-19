import { PassportStatic } from "passport";
import config from "../../config/config";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JWTStrategy } from "passport-jwt";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import UserService from "../../services/user.service";
import User from "../../models/user.model";
import { UserDocument, StatusCode, ErrorResponse } from "../../types";
import { Request } from "express";
import _ from "lodash";
/**
 *
 * @param passport
 */
function PassportLoad(passport: PassportStatic) {
  //SIGN UP STRATEGY
  passport.use(
    "signup",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        session: false,
        passReqToCallback: true,
      },
      (req: Request, email: string, password: string, done: Function): void => {
        process.nextTick(async () => {
          try {
            const newUser = await UserService.createUser({
              ...req.body,
              email,
              password,
            });
            done(null, newUser);
          } catch (error) {
            done(error); // Pass the error to the passport callback
          }
        });
      }
    )
  );
  //LOGIN STRATEGY
  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "user",
        passwordField: "password",
      },
      async (user: string, password: string, done: Function): Promise<void> => {
        let errorMessage: ErrorResponse;
        //Find User in the database using the email or username field
        const userDetail = await UserService.loginUser(user);
        //If user does not exist, throw not found error
        if (!userDetail) {
          errorMessage = {
            message: "User does not exist, please sign up",
            statusCode: StatusCode.NOT_FOUND,
            code: StatusCode.USER_NOT_FOUND,
          };
          return done(null, false, errorMessage);
        } else {
          const checkPass = await userDetail.isValidPassword(password);
          //Throw error if password is not valid
          if (!checkPass) {
            errorMessage = {
              message:
                "Invalid Credentials, please ensure login details are correct",
              code: StatusCode.BADREQUEST_ERROR,
            };
            return done(null, false, errorMessage);
          }
          done(null, userDetail);
        }
      }
    )
  );
  // GOOGLE STRATEGY
  passport.use(
    "google",
    new GoogleStrategy(
      {
        clientID: config.CLIENT_ID,
        clientSecret: config.CLIENT_SECRET,
        callbackURL: config.CALLBACK_URL,
        passReqToCallback: true,
        scope: ["email", "profile"],
      },
      async (
        request: Request,
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: Function
      ) => {
        // Check if user exists
        const user = <UserDocument>await User.findOne({
          $or: [{ googleID: profile.id }, { email: profile.email }],
        });
        if (user) {
          user.googleID = profile.id;
          await user.save();
          return done(null, user);
        } else {
          const newUser = await UserService.createUser({ ...profile });
          return done(null, newUser);
        }
      }
    )
  );

  //Cookie Extractor
  let jwtExtractor = function (req: Request): string {
    let token: any = null;
    const { authorization } = req.headers;
    if (authorization && authorization.startsWith("Bearer ")) {
      token = authorization.split(" ")[1];
    } else if (req && req.signedCookies.accessToken) {
      token = req.signedCookies["accessToken"];
    }
    return token;
  };
  //JWT Strategy
  passport.use(
    "jwt",
    new JWTStrategy(
      {
        secretOrKey: config.JWT_SECRET,
        jwtFromRequest: jwtExtractor,
      },
      async function (jwt_payload: any, done: Function) {
        //Check if the user saved in token exist in database
        const user = await UserService.getUserByUserID(jwt_payload.user.userID);
        //If the user does not exist, throw not logged in user
        if (!user) {
          done(null, false);
        }
        done(null, user);
      }
    )
  );
  passport.serializeUser<any, any>(
    (req: Request, user: any, done: Function): void => {
      done(null, user.userID);
    }
  );
  //Deserialize User
  passport.deserializeUser<any>((userID: string, done: Function): void => {
    UserService.getUserByUserID(userID)
      .then((user) => {
        done(null, user);
      })
      .catch((err) => done(null, err));
  });
}
export default PassportLoad;
