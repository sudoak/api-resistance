require('dotenv').config()

const express = require('express');
const morgan = require('morgan');
const app = express();
const ipfilter = require('express-ipfilter').IpFilter
const jwt = require('express-jwt');
const dayJs = require('dayjs'); 
const { init } = require('./config/database.config');
const rateLimiterRedisMiddleware = require('./config/ratelimit');
const JWT_SECRET = process.env.JWT_SECRET;

const { users } = require("./config/constants");
const { customDetection, errorHandler } = require("./util");
const errorMiddleware = require('./util/errorMiddleware');

const ips = users.map( user => user.ip );
const { createToken, getRecords } = require('./services');

app.use(express.json());
app.use(morgan('combined'));
app.use(ipfilter(ips, { mode: 'allow', detectIp: customDetection }))
app.use(rateLimiterRedisMiddleware);

//Initialize DB
init();

app.get("/", async (req, res) => res.send(`hi ${req.ip}`));

app.post("/users/token", errorHandler((req, res) => {
  const token = createToken(req.body);
  res.send(token);
}));

app.post("/data/records", jwt({ secret: JWT_SECRET, algorithms: ['HS256'] }), errorHandler(async (req, res) => {
  const { month, device_id, year } = req.body;
  const data = await getRecords(device_id, month, year);
  const response = {
    data,
    count: data.length,
    timestamp: dayJs().format()
  }
  res.send(response);
}));

app.use(errorMiddleware)


module.exports = app;