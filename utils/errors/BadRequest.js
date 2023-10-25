const {
  ERROR_INCORRECT_DATA,
} = require('../http_codes');

module.exports = class BadRequest extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_INCORRECT_DATA;
  }
};
