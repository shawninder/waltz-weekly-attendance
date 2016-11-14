'use strict';

const connect = require('connect');
const validate = require('./validate');
const getAttendance = require('./getAttendance');
const get = require('./get');
const seeReadme = require('./seeReadme');

module.exports = exports = {
  get,
  start(options, cb) {
    if (!options.apiURL) {
      throw new Error(`Incorrect Usage: You must provide \`apiURL\`, ${seeReadme}`);
    }

    this.apiURL = options.apiURL;
    const app = connect();

    app.use(validate(this));
    app.use(getAttendance(this));
    const handle = app.listen(process.env.PORT || 0, (err) => {
      if (err) {
        return cb(err);
      }

      return cb(null, handle);
    });
  },
};
