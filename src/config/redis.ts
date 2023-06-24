import { createClient } from "redis";
import logger from "../utils/logger/logger";

async function connectToRedis() {
  try {
    console.log("entered here");
    const client = createClient({ url: "redis://localhost:6379" });
    await new Promise<void>((resolve, reject) => {
      client.on("connect", () => {
        logger.info("Connected to Redis");
        resolve();
      });
      client.on("error", (error) => {
        logger.error("Redis connection error:", error);
        reject(error);
      });
    });
    console.log("done");
  } catch (error) {
    logger.error("Failed to connect to Redis:", error);
  }
}

export default connectToRedis;
