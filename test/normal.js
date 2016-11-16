'use strict';

const test = require('ava').test;
const server = require('../');
const mock = require('./mock');
const routes = require('./data/normal');
const runTest = require('./run');

let mockServer = null;
let serverInstance = null;

test.before((t) => new Promise((resolve, reject) => {
  mock.start(routes, (mockStartErr, mockInstance) => {
    if (mockStartErr) {
      t.fail("Can't launch mock");
      reject(mockStartErr);
    } else {
      mockServer = mockInstance;
      server.start({ apiURL: 'http://localhost:3001/' }, (startErr, instance) => {
        if (startErr) {
          t.fail("Can't launch server");
          reject(startErr);
        } else {
          serverInstance = instance;
          resolve();
        }
      });
    }
  });
}));

test.after.always((t) => new Promise((resolve, reject) => {
  if (serverInstance) {
    serverInstance.stop((stopErr) => {
      if (stopErr) {
        t.fail("Can't stop server");
        reject(stopErr);
      } else if (mockServer) {
        mockServer.stop((mockStopErr) => {
          if (mockStopErr) {
            t.fail("Can't stop mock");
            reject(mockStopErr);
          } else {
            resolve();
          }
        });
      } else {
        reject(new Error('Mock not ready'));
      }
    });
  } else {
    reject(new Error('Server not ready'));
  }
}));

test('Bad Request', (t) => runTest({
  port: serverInstance.handle.address().port,
  queryStr: '',
  expect: (resolve, reject) => (error, response) => {
    if (error) {
      t.fail("Can't reach server");
      reject(error);
    } else {
      t.is(response.statusCode, 400);
      resolve();
    }
  },
}));

test('Bad week', (t) => {
  runTest({
    port: serverInstance.handle.address().port,
    queryStr: '?week=999',
    expect: (resolve, reject) => (error, response) => {
      if (error) {
        t.fail("Can't reach server");
        reject(error);
      } else {
        t.is(response.statusCode, 400);
        resolve();
      }
    },
  });
});

const weeks = routes['/weeks'];

const weekFactory = function weekFactory(week) {
  return (t) => runTest({
    port: serverInstance.handle.address().port,
    queryStr: `?week=${week.week}`,
    expect: (resolve, reject) => (error, response, body) => {
      if (error) {
        t.fail("Can't reach server");
        reject(error);
      } else {
        t.is(response.statusCode, 200);
        let schedule = null;

        try {
          schedule = JSON.parse(body);
          t.is(schedule.length, week.expected.length);
          resolve();
        } catch (ex) {
          t.fail(`Can't JSON.parse response: ${body}`);
          reject(ex);
        }
      }
    },
  });
};

for (let i = 0, len = weeks.length; i < len; i += 1) {
  test(`Week ${weeks[i].week}`, weekFactory(weeks[i]));
}
