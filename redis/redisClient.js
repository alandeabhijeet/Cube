
require('dotenv').config();

const {createClient } = require('redis');

const redisClient = createClient({
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port:  process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 12932
    }
});

redisClient.on('error', err => console.error('Redis Client Error', err));

let isConnected = false;

async function connectRedis() {
  if (!isConnected) {
    await redisClient.connect();
    isConnected = true;
  }
}

module.exports = {
  redisClient,
  connectRedis
};
