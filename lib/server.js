'use strict';

const connect = require('connect');
const validate = require('./validate');
const getAttendance = require('./get-attendance');
const get = require('./get');
const seeReadme = require('./see-readme');

module.exports = exports = {
  get,
  start(options, cb) {
    if (!options.apiURL) {
      throw new Error('Incorrect Usage: You must provide `apiURL`, ' + seeReadme);
    }

    this.apiURL = options.apiURL;
    let app = connect();
    app.use(validate(this));
    app.use(getAttendance(this));
    let handle = app.listen(process.env.PORT || 0, function listenCB(err) {
      if (err) {
        cb(err);
      } else {
        cb(null, handle);
      }
    });
  }
};
