'use strict';

const request = require('requestretry');

module.exports = function runTest({ port, queryStr, expect }) {
  return new Promise((resolve, reject) => {
    const url = `http://localhost:${port}/${queryStr}`;

    request(url, expect(resolve, reject));
  });
};
