'use strict';

const request = require('request');

module.exports = exports = function get(endpoint) {
  let prom = new Promise((resolve, reject) => {
    request(this.apiURL, (err, res, body) => {
      if (err) {
        err.getting = 'root';
        reject(err);
      } else {
        resolve(JSON.parse(body));
      }
    });
  });
  return prom.then((endpoints) => {
    const url = endpoints.links[endpoint];
    return new Promise((resolve, reject) => {
      request(url, (err, res, body) => {
        if (err) {
          err.getting = endpoint;
          reject(err);
        } else {
          resolve(JSON.parse(body));
        }
      });
    });
  });
};
