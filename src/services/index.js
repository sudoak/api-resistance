const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const { find } = require('lodash');
const { users } = require('../config/constants');
const RECORDS = require('../model/records.schema');
const REDIS_CLIENT = require('../config/redis');

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

const isPresent = key => {
  REDIS_CLIENT.exists(key,function(err,reply) {
    if(!err) {
      if(reply === 1) {
        console.log("2", reply)
        return true;
      }
    }
    return false;
  });   
}

const getRedisRecords = key => {
  console.log("lol");
  return new Promise((resolve, reject) => {
    REDIS_CLIENT.get(key, (err, data) => {
      if (err) console.log(err);
      console.log("3", data)
      resolve(data)
    });
  })
  
}

const setRedisRecords = (key, data) => {
  try{
    REDIS_CLIENT.setex(key, 604800, JSON.stringify(data));
  }catch(err){
    console.log(err)
  }
}
const getRecords = async (device_id = "XXXX", month = "01", year = "2020") => {
  // db.xecords.aggregate([{ '$project': {     device_id:1, recordedTime:1, month: { $substr: ["$recordedTime", 5, 2] } }  }, {$match: {month:"12"}}]);
  
  const key = `${month}-${year}-${device_id}`;
  console.log("1", key);
  let data;
  if(isPresent(key)) {
      console.log("yay");
      data = await getRedisRecords(key);
      return JSON.parse(data);
  }
  data = await RECORDS.aggregate([
    { $project: { _id:0, 
      device_id: 1, 
      e1: 1, e2: 1, e3: 1, e4: 1, e5: 1, recordedTime: 1, 
      month: { $substr: ["$recordedTime", 5, 2] },
      year: { $substr: ["$recordedTime", 0, 4] }
    }},
    { $match: { month, device_id, year }}
  ]).allowDiskUse(true);
  setRedisRecords(key, data);
  return data;
}

module.exports = {
  createToken,
  getRecords
}