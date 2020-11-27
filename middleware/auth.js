const config = require('../config');

module.exports = {
  requireToken: (req, res, next) => {
    if (req.headers.authorization === config.token) return next();
    return res.sendStatus(403);
  },
};
