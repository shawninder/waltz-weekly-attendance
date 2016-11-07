'use strict'

const XDate = require('xdate')
const seeReadme = require('./see-readme')

module.exports = exports = function getAttendanceFactory (server) {
  return function getAttendance (req, res, next) {
    Promise.all([
      server.get('/weeks')
        .catch(function (err) {
          console.error(`Can't get weeks: ${err}. Make sure the apiURL option is correct and that it is up and running. For more info, ${seeReadme}`)
          res.statusCode = 500
          res.write('Try again later')
          res.end()
        }),
      server.get('/holidays')
        .catch(function (err) {
          console.error(`Can't get holidays: ${err}. Make sure the apiURL option is correct and that it is up and running. For more info, ${seeReadme}`)
          res.statusCode = 500
          res.write('Try again later')
          res.end()
        })
    ])
      .then(function (arr) {
        const weeks = arr[0]
        var found = false
        for (let i = 0, len = weeks.length; !found && i < len; i += 1) {
          if (weeks[i].week === req.week) {
            found = weeks[i]
          }
        }
        // Make sure we know about the requested week
        if (!found) {
          res.statusCode = 400
          res.write("Bad Request: requested week doesn't exist, " + seeReadme)
          res.end()
        } else {
          const week = found
          const start = new XDate(week.start + ' UTC', true)
          const startTime = start.getTime()
          const end = new XDate(week.end + ' UTC', true)
          const endTime = end.getTime()
          const holidays = arr[1]
          // console.log('week', week)
          // console.log('serverTime', serverTime)
          // console.log('holidays', holidays)
          var skip = []
          for (let i = 0, len = holidays.length; i < len; i += 1) {
            let date = new XDate(holidays[i].date + ' UTC', true)
            let dateTime = date.getTime()
            if (dateTime >= startTime && dateTime <= endTime) {
              skip.push((new XDate(holidays[i].date + ' UTC', true)).getTime())
            }
          }
          var days = getDays(week, skip)
          res.statusCode = 200
          res.write(JSON.stringify(days, null, 2))
          res.end()
        }
      })
      .catch(function (reason) {
        console.log('ERROR', reason)
        res.statusCode = 500
        res.write(reason.stack || reason.toString())
        res.end()
      })
  }
}

function getDays (week, skip) {
  var days = []
  var i = new XDate(week.start + ' UTC', true)
  const end = new XDate(week.end + ' UTC', true)
  while (i.diffDays(end) >= 0) {
    if (skip.indexOf(i.getTime()) === -1) {
      days.push({ date: i.toUTCString() })
    }
    i = nextDay(i)
  }
  return days
}

function nextDay (day) {
  const DAY_IN_MS = 24 * 60 * 60 * 1000
  return new XDate(day.getTime() + DAY_IN_MS, true)
}
