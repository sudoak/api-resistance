require('dotenv').config()

const express = require('express');
const morgan = require('morgan');
const app = express();

const { init } = require('./config/database.config');

const errorMiddleware = require('./util/errorMiddleware');
app.use(express.json());
app.use(morgan('combined'));

//Initialize DB
init();

app.get("/", async (req, res) => res.send(req.ip));

app.use(errorMiddleware)


module.exports = app;