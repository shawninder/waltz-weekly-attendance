'use strict';

const XDate = require('xdate');

const DAY_IN_MS = 24 * 60 * 60 * 1000;



const getDays = function getDays(week, holidays) {
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
  let days = [];
  let current = new XDate(week.start + ' UTC', true);
  while (current.diffDays(end) >= 0) {
    if (skip.indexOf(current.getTime()) === -1) {
      days.push({ date: current.toUTCString('ddd, MMM dd yyyy'), invited: [] });
    }
    current = nextDay(current);
  }

  return { days, skip };
};

const nextDay = function nextDay(day) {
  return new XDate(day.getTime() + DAY_IN_MS, true);
};

module.exports = exports = {
    DAY_IN_MS,
    getDays,
    nextDay,
};
