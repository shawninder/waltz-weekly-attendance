'use strict';

const XDate = require('xdate');
const seeReadme = require('./seeReadme');

const DAY_IN_MS = 24 * 60 * 60 * 1000;

const getDays = function getDays(week, skip) {
  const end = new XDate(week.end + ' UTC', true);
  let days = [];
  let current = new XDate(week.start + ' UTC', true);
  while (current.diffDays(end) >= 0) {
    if (skip.indexOf(current.getTime()) === -1) {
      days.push({ date: current.toUTCString() });
    }
    current = nextDay(current);
  }

  return days;
};

const nextDay = function nextDay(day) {
  return new XDate(day.getTime() + DAY_IN_MS, true);
};

module.exports = exports = function getAttendanceFactory(server) {
  return function getAttendance(req, res, next) {
    Promise.all([
      server.get('/weeks')
        .catch((err) => {
          console.error(`Can't get weeks: ${err}. Make sure the apiURL option is correct and that it is up and running. For more info, ${seeReadme}`);
          res.statusCode = 500;
          res.write('Try again later');
          res.end();
        }),
      server.get('/holidays')
        .catch((err) => {
          console.error(`Can't get holidays: ${err}. Make sure the apiURL option is correct and that it is up and running. For more info, ${seeReadme}`);
          res.statusCode = 500;
          res.write('Try again later');
          res.end();
        }),
    ])

      // FIXME Rename this next function
      .then(function burp([weeks, holidays]) {
        let found = false;
        for (let i = 0, len = weeks.length; !found && i < len; i += 1) {
          if (weeks[i].week === req.week) {
            found = weeks[i];
          }
        }

        // Make sure we know about the requested week
        if (!found) {
          res.statusCode = 400;
          res.write("Bad Request: requested week doesn't exist, " + seeReadme);
          res.end();
        } else {
          const week = found;
          const start = new XDate(week.start + ' UTC', true);
          const startTime = start.getTime();
          const end = new XDate(week.end + ' UTC', true);
          const endTime = end.getTime();
          let skip = [];
          for (let i = 0, len = holidays.length; i < len; i += 1) {
            let date = new XDate(holidays[i].date + ' UTC', true);
            let dateTime = date.getTime();
            if (dateTime >= startTime && dateTime <= endTime) {
              skip.push((new XDate(holidays[i].date + ' UTC', true)).getTime());
            }
          }

          let days = getDays(week, skip);
          res.statusCode = 200;

          // TODO Remove pretty
          res.write(JSON.stringify(days, null, 2));
          res.end();
        }
      })

      // FIXME: Rename when burp is renamed
      .catch((reason) => {
        console.log('ERROR', reason);
        res.statusCode = 500;
        res.write(reason.stack || reason.toString());
        res.end();
      });
  };
};
