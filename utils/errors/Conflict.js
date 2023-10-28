const {
  ERROR_CONFLICT,
} = require('../http_codes');

module.exports = class Conflict extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_CONFLICT;
  }
};
