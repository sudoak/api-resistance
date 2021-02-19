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

const getRecords = async (device_id = "XXXX", month = "01") => {
  // db.xecords.aggregate([{ '$project': {     device_id:1, recordedTime:1, month: { $substr: ["$recordedTime", 5, 2] } }  }, {$match: {month:"12"}}]);
  return await RECORDS.aggregate([
    { $project: { _id:0, device_id: 1, e1: 1, e2: 1, e3: 1, e4: 1, e5: 1, recordedTime: 1, month: { $substr: ["$recordedTime", 5, 2] }}},
    { $match: { month, device_id }}
  ]).allowDiskUse(true);;

}

module.exports = {
  createToken,
  getRecords
}