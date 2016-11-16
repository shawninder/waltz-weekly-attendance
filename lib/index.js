'use strict';

const connect = require('connect');
const validate = require('./validate');
const getAttendance = require('./getAttendance');
const get = require('./get');
const seeReadme = require('./seeReadme');
const toobusy = require('toobusy-js');
const busy = require('./busy');

module.exports = exports = {
  get,
  start(options, cb) {
    if (!options.apiURL) {
      throw new Error(`Incorrect Usage: You must provide \`apiURL\`, ${seeReadme}`);
    }

    this.apiURL = options.apiURL;
    this.app = connect();
    this.app.use(busy(toobusy));
    this.app.use(validate(this));
    this.app.use(getAttendance(this));
    this.handle = this.app.listen(process.env.PORT || 0, (err) => {
      if (err) {
        return cb(err);
      }

      return cb(null, this);
    });
  },
  stop(cb) {
    toobusy.shutdown();
    this.handle.close(cb);
  }
};
