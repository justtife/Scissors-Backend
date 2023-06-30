import { PassportStatic } from "passport";
import { mainConfig } from "../../config/config";
const config = mainConfig[process.env.APP_ENV as string];
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JWTStrategy } from "passport-jwt";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import UserService from "../../services/user.service";
import saveOnCloudinary from "../helpers/cloudinary";
import User from "../../models/user.model";
import { UserDocument, StatusCode, ErrorResponse } from "../../types";
import { Request } from "express";
import { v4 as uuidv4 } from "uuid";

import { generateDefaultProfilePic } from "../helpers/defaultProfilePic";
import _ from "lodash";
/**
 *
 * @param passport
 */
function PassportLoad(passport: PassportStatic) {
  //SIGN UP STRATEGY
  let errorMessage: ErrorResponse;
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
          //Check if email exists
          const user = await UserService.getUserCreate(email);
          if (user) {
            errorMessage = {
              message: "User with email exist, please signup with a new mail",
              code: StatusCode.DUPLICATE_ERROR,
              statusCode: StatusCode.CONFLICT,
            };
            return done(null, false, errorMessage);
          } else {
            // if there is no user with that email, create new user
            var newUser = new User();
            // set the user's local credentials
            newUser.name = {
              first: req.body.firstname,
              last: req.body.lastname,
              user: req.body.username,
            };
            newUser.email = email;
            newUser.password = password;
            newUser.sex = req.body.sex;
            newUser.nationality = req.body.nationality;
            newUser.userID = uuidv4().slice(0, 7);
            newUser.profilePic = req.body.profilePic;
            let name = req.body.firstname + " " + req.body.lastname;
            let image = generateDefaultProfilePic(name);
            const saveImage = await saveOnCloudinary(
              image,
              `default_${email}`,
              "scissors_user"
            );
            newUser.defaultPic = saveImage.secure_url;
            newUser
              .save()
              .then((savedUser: UserDocument) => {
                done(null, savedUser);
              })
              .catch((err: Error) => {
                errorMessage = {
                  message: `An error occurred saving to the database: ${err}`,
                  status: "failed",
                };
                done(err, false, errorMessage);
              });
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
              statusCode: StatusCode.BAD_REQUEST,
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
          //If there is a user
          //Return User
          user.googleID = profile.id;
          await user.save();
          return done(null, user);
        } else {
          // if there is no user with that email
          // create new user
          var newUser = new User();

          // set the user's local credentials
          newUser.googleID = profile.id;
          newUser.email = profile.email;
          newUser.name.user = profile.email;
          newUser.name.first = profile.given_name;
          newUser.name.last = profile.family_name;
          newUser.userID = uuidv4().slice(0, 7);
          newUser.profilePic = profile.photos[0].value;
          let name = profile.given_name + " " + profile.family_name;
          let image = generateDefaultProfilePic(name);
          const saveImage = await saveOnCloudinary(
            image,
            `default_${profile.email}`,
            "scissors_user"
          );
          newUser.defaultPic = saveImage.secure_url;
          newUser
            .save()
            .then((savedUser: UserDocument) => {
              done(null, savedUser);
            })
            .catch((err: Error) => {
              errorMessage = {
                message: `An error occurred saving to the database: ${err}`,
                status: "failed",
              };
              done(err, false, errorMessage);
            });
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
        const user = <UserDocument>await User.findOne({
          userID: jwt_payload.user.userID,
        });
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
      done(null, user.id);
    }
  );
  //Deserialize User
  passport.deserializeUser<any>((id: number, done: Function): void => {
    User.findById(id)
      .then((user) => done(null, user))
      .catch((err) => done(null, err));
  });
}
export default PassportLoad;
