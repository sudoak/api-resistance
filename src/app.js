require('dotenv').config()

const express = require('express');
const morgan = require('morgan');
const app = express();
const ipfilter = require('express-ipfilter').IpFilter

const { init } = require('./config/database.config');
const { ips } = require("./config/constants");

const errorMiddleware = require('./util/errorMiddleware');
app.use(express.json());
app.use(morgan('combined'));
app.use(ipfilter(ips, { mode: 'allow' }))
//Initialize DB
init();

app.get("/", async (req, res) => res.send(req.ip));

app.use(errorMiddleware)


module.exports = app;