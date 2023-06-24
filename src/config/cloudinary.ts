import { mainConfig } from "./config";
const config = mainConfig[process.env.APP_ENV as string];
import cloudinary from "cloudinary";
cloudinary.v2.config({
  cloud_name: config.CLOUD_NAME,
  api_key: config.API_KEY,
  api_secret: config.API_SECRET,
});
export default cloudinary;
