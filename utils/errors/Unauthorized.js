const {
  ERROR_UNAUTHORIZED,
} = require('../http_codes');

module.exports = class Unauthorized extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_UNAUTHORIZED;
  }
};
