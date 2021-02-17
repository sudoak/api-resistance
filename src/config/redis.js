const redis = require('redis');
const RedisClient = redis.createClient();

RedisClient.on("connect", function () {
  console.log("Redis client connected");
});

RedisClient.on("error", function (err) {
  console.log("Something went wrong " + err);
});

module.exports = RedisClient;