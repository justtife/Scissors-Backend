import { app } from "./index";
import logger from "./utils/logger/logger";
import connectToRedis from "./config/redis";
import config from "./config/config";
//Import connectDB
import connectDB from "./config/db";
//Start Server
const start = async () => {
  if (process.env.APP_ENV !== "test") {
    //Connect to DB
    await connectDB(config.DB_URI);
    // await connectToRedis();
    //Start Server
    app
      .listen(config.PORT, "0.0.0.0", () => {
        logger.info(
          `Server is listening on port ${config.PORT} and running in ${process.env.APP_ENV} mode`
        );
      })
      //Server Error
      .on("error", (error: Error) => {
        logger.error(`Error starting server: ${error.message}`);
        process.exit(1);
      });
  }
};
start();
