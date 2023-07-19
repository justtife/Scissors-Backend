import config from "./config";
export = {
  service: "gmail",
  auth: {
    user: config.MAIL_USER,
    pass: config.MAIL_PASS,
  },
};
