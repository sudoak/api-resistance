const jwt = require('jsonwebtoken');

const expiresIn = process.env.EXPIRES_IN;
const SECRET = process.env.JWT_SECRET;

const createBase64String = data => {
  let buff = new Buffer(data);
  return buff.toString('base64');
}

const createToken = ({ id }) => {
  data = createBase64String(id);
  return jwt.sign({
    data
  }, SECRET, { expiresIn, algorithm: 'RS256' });
}

module.exports = {
  createToken
}