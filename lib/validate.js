'use strict';

const url = require('url');
const qs = require('qs');
const seeReadme = require('./seeReadme');

module.exports = exports = function validateFactory(server) {
  return function validate(req, res, next) {
    const parts = url.parse(req.url);
    const query = qs.parse(parts.query);

    // Is provided week a positive integer?
    const week = parseFloat(query.week);
    if (!week || week < 0 || !isFinite(week) || Math.floor(week) !== week) {
      res.statusCode = 400;
      res.write('Bad Request, ' + seeReadme);
      res.end();
    } else {
      // Mutating function parameter, this is how middleware is intended to work
      req.week = parseInt(week, 10);
      next();
    }
  };
};
