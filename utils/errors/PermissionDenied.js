const {
  ERROR_FORBIDDEN,
} = require('../http_codes');

module.exports = class PermissionDenied extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_FORBIDDEN;
  }
};
