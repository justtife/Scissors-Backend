import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
const mongoServer = new MongoMemoryServer();

let dbConnect = async () => {
  const uri = await mongoServer.getUri();
  await mongoose.connect(uri);
};

let dbDisconnect = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
};

export { dbConnect, dbDisconnect };
