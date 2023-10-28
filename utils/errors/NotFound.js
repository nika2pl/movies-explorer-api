const {
  ERROR_NOT_FOUND,
} = require('../http_codes');

module.exports = class NotFound extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_NOT_FOUND;
  }
};
