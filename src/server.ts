import { app } from "./index";
import logger from "./utils/logger/logger";
import { mainConfig } from "./config/config";
import connectToRedis from "./config/redis";
const config = mainConfig[process.env.APP_ENV as string];
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
      .listen(config.PORT, () => {
        logger.info(`Server is listening on port ${config.PORT}`);
      })
      //Server Error
      .on("error", (error: Error) => {
        logger.error(`Error starting server: ${error.message}`);
        process.exit(1);
      });
  }
};
start();
