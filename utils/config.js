const URL_REGEX = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;
const URL_MONGO = (process.env.NODE_ENV === 'production') ? process.env.URL_MONGO : 'mongodb://127.0.0.1:27017/bitfilmsdb';
const { SECRET_KEY = 'some-secret-key' } = process.env;
const { PORT = 3000 } = process.env;

module.exports.URL_REGEX = URL_REGEX;
module.exports.SECRET_KEY = SECRET_KEY;
module.exports.URL_MONGO = URL_MONGO;
module.exports.PORT = PORT;
