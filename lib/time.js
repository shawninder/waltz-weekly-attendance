'use strict';

const XDate = require('xdate');

const DAY_IN_MS = 24 * 60 * 60 * 1000;

const getDays = function getDays(week, skip) {
  const end = new XDate(week.end + ' UTC', true);
  let days = [];
  let current = new XDate(week.start + ' UTC', true);
  while (current.diffDays(end) >= 0) {
    if (skip.indexOf(current.getTime()) === -1) {
      days.push({ date: current.toUTCString('ddd, MMM dd yyyy'), invited: [] });
    }
    current = nextDay(current);
  }

  return days;
};

const nextDay = function nextDay(day) {
  return new XDate(day.getTime() + DAY_IN_MS, true);
};

module.exports = exports = {
    DAY_IN_MS,
    getDays,
    nextDay,
};
