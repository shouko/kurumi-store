const bodyParser = require('body-parser');

const options = { limit: '102400kb' };

module.exports = [
  bodyParser.urlencoded({ ...options, extended: false }),
  bodyParser.json(options),
];
