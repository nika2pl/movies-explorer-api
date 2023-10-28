const jwt = require('jsonwebtoken');
const Unauthorized = require('../utils/errors/Unauthorized');
const { SECRET_KEY } = require('../utils/config');
const { UNAUTHORIZED_REQUEST } = require('../utils/messages');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return next(new Unauthorized(UNAUTHORIZED_REQUEST));
  }

  let payload;

  try {
    payload = jwt.verify(token, SECRET_KEY);
  } catch (err) {
    return next(new Unauthorized(UNAUTHORIZED_REQUEST));
  }

  req.user = payload;

  return next();
};
