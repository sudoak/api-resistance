require('dotenv').config()

const express = require('express');
const morgan = require('morgan');
const app = express();
const ipfilter = require('express-ipfilter').IpFilter

const { init } = require('./config/database.config');
const rateLimiterRedisMiddleware = require('./config/ratelimit');

const { users } = require("./config/constants");
const { customDetection } = require("./util");
const errorMiddleware = require('./util/errorMiddleware');

const ips = users.map( user => user.ip );
const { createToken } = require('./services');

app.use(express.json());
app.use(morgan('combined'));
app.use(ipfilter(ips, { mode: 'allow', detectIp: customDetection }))
app.use(rateLimiterRedisMiddleware);

//Initialize DB
init();

app.get("/", async (req, res) => res.send(`hi ${req.ip}`));
app.post("/users/token", async (req, res) => {
  const token = createToken(req.body);
  res.send(token);
});


app.use(errorMiddleware)


module.exports = app;