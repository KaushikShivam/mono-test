/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const {
  JWT_SECRET,
  JWT_EXPIRES_IN,
  NODE_ENV,
} = require('./fixtures/constants');

let mongo;
beforeAll(async () => {
  process.env.JWT_SECRET = JWT_SECRET;
  process.env.JWT_EXPIRES_IN = JWT_EXPIRES_IN;
  process.env.NODE_ENV = NODE_ENV;

  mongo = await MongoMemoryServer.create();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (const collection of collections) {
    await collection.deleteMany();
  }
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongo.stop();
});
