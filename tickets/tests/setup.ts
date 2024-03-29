import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

global.console = {
  ...console,
  log: jest.fn(),
};

jest.mock('../src/lib/objects/nats/stan-singleton');

let mongo: MongoMemoryServer | undefined = undefined;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();
  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();
  for (const collection of collections) await collection.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
  if (mongo) await mongo.stop();
});
