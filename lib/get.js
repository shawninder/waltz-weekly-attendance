'use strict';

const request = require('requestretry');

module.exports = function get(endpoint) {
  const prom = new Promise((resolve, reject) => {
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
