'use strict';

const request = require('request');

module.exports = exports = function get(endpoint) {
  return new Promise((resolve, reject) => {
    const url = this.apiURL + endpoint;
    request(url, function reqCb(err, res, body) {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(body));
      }
    });
  });
};
