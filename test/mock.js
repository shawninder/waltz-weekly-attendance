'use strict';

const connect = require('connect');
const toobusy = require('toobusy-js');
const busy = require('../lib/busy');


module.exports = {
  start(routes, cb) {
    routes['/favicon'] = {};
    this.app = connect();
    this.app.use(busy(toobusy));
    this.app.use((req, res) => {
      const key = req.originalUrl;

      if (routes[key]) {
        res.statusCode = 200;
        res.write(JSON.stringify(routes[key]));

        return res.end();
      }
      res.statusCode = 404;
      res.write('Not Found');

      return res.end();
    });

    this.handle = this.app.listen(3001, () => {
      cb(null, this);
    });
  },
  stop(cb) {
    toobusy.shutdown();
    this.handle.close(cb);
  }
};
