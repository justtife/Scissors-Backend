import { mainConfig } from "./config";
const config = mainConfig[process.env.APP_ENV as string];
export = {
  service: "gmail",
  auth: {
    user: config.MAIL_USER,
    pass: config.MAIL_PASS,
  },
};