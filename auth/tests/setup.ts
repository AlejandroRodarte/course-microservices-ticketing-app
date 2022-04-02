import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

import app from '../src/app';

let mongo: MongoMemoryServer | undefined = undefined;

beforeAll(async () => {
  mongo = new MongoMemoryServer();
  const mongoUri = mongo.getUri();
  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (const collection of collections) await collection.deleteMany({});
});

afterAll(async () => {
  if (mongo) await mongo.stop();
  await mongoose.connection.close();
});
