const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const { find } = require('lodash');
const { users } = require('../config/constants');
const RECORDS = require('../model/records.schema');

const expiresIn = process.env.EXPIRES_IN;
const SECRET = process.env.JWT_SECRET;

const createBase64String = data => {
  let buff = new Buffer(data);
  return buff.toString('base64');
}

const createToken = ({ id }) => {
  const user = find(users, { id });
  if(!user){
    throw createError(404, "User Not found");
  }
  data = createBase64String(id);
  return jwt.sign({ data }, SECRET, { expiresIn, algorithm: 'HS256' });
}

const getRecords = async device_id => {
  
}
module.exports = {
  createToken
}