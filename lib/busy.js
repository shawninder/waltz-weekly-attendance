'use strict';

module.exports = function busy(toobusy) {
  return (req, res, next) => {
    if (toobusy()) {
      res.statusCode = 503;
      res.headers['RETRY-AFTER'] = 1;
      res.write('Temporarily unavailable, please try again later.');

      return res.end();
    }

    return next();
  };
};
