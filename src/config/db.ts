import mongoose from "mongoose";
import logger from "../utils/logger/logger";
const connectDB = async (url: string) => {
  const conn = await mongoose.connect(url, { maxPoolSize: 10 });
  logger.info(`MongoDB Connected: ${conn.connection.host}`);
};
export default connectDB;
