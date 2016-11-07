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
      days.push({ date: current.toUTCString('ddd, MMM dd yyyy'), invited: [] });
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
          return res.end();
        }),
      server.get('/holidays')
        .catch((err) => {
          console.error(`Can't get holidays: ${err}. Make sure the apiURL option is correct and that it is up and running. For more info, ${seeReadme}`);
          res.statusCode = 500;
          res.write('Try again later');
          return res.end();
        }),
      server.get('/ministers')
        .catch((err) => {
          console.error(`Can't get holidays: ${err}. Make sure the apiURL option is correct and that it is up and running. For more info, ${seeReadme}`);
          res.statusCode = 500;
          res.write('Try again later');
          return res.end();
        }),
      server.get('/rules')
        .catch((err) => {
          console.error(`Can't get holidays: ${err}. Make sure the apiURL option is correct and that it is up and running. For more info, ${seeReadme}`);
          res.statusCode = 500;
          res.write('Try again later');
          return res.end();
        }),
    ])

      // FIXME Rename this next function
      .then(function burp([weeks, holidays, originalMinisters, rules]) {
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
          return res.end();
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
          if (days.length === 0) {
            res.statusCode = 200;
            res.write('[]');
            return res.end();
          } else {
            let ministers = {};
            for (let i = 0, len = originalMinisters.length; i < len; i += 1) {
              let item = originalMinisters[i];
              item.nbSessions = 0;
              ministers[item.id] = item;
              delete ministers[item.id].id;
            }
            let requiredParties;
            let minMinistersPerSession = 0;
            for (let i = 0, len = rules.length; i < len; i += 1) {
              let rule = rules[i];
              switch (rule.rule_id) {
                case 1:
                  minMinistersPerSession = rule.value;
                  break;
                case 2: {
                  let ids = rule.minister_id;
                  let value = rule.value;
                  if (!ids) {
                    for (let key in ministers) {
                      let item = ministers[key];
                      if (!item.maxSessionsPerWeek) {
                        item.maxSessionsPerWeek = value;
                      }
                    }
                  } else if (Array.isArray(ids)) {
                    for (let i = 0, len = ids.length; i < len; i += 1) {
                      ministers[ids[i]].maxSessionsPerWeek = value;
                    }
                  } else {
                    ministers[ids].maxSessionsPerWeek = value;
                  }
                  break;
                }
                case 4: {
                  let ids = rule.minister_id;
                  let value = rule.value - skip.length;
                  if (value < 0) {
                    value = 0;
                  }
                  if (!ids) {
                    for (let key in ministers) {
                      let item = ministers[key];
                      if (!item.minSessionsPerWeek) {
                        item.minSessionsPerWeek = value;
                      }
                    }
                  } else if (Array.isArray(ids)) {
                    for (let i = 0, len = ids.length; i < len; i += 1) {
                      ministers[ids[i]].minSessionsPerWeek = value;
                    }
                  } else {
                    ministers[ids].minSessionsPerWeek = value;
                  }
                  break;
                }
                case 8:
                  let ids = rule.minister_id;
                  if (!ids) {
                    for (let key in ministers) {
                      ministers[key].forceMax = true;
                    }
                  } else if (Array.isArray(ids)) {
                    for (let i = 0, len = ids.length; i < len; i += 1) {
                      ministers[ids[i]].forceMax = true;
                    }
                  } else {
                    ministers[ids].forceMax = true;
                  }
                  break;
                case 12:
                  requiredParties = rule.value;
                  break;
                default:
                  // TODO: This should send a warning to an admin
                  console.log('Unknown rule', rule, 'ignoring')
                  break;
              }
            }
            let error = false;
            for (let i = 0, len = days.length; i < len && !error; i += 1) {
              let day = days[i];
              for (let key in ministers) {
                let minister = ministers[key];
                if (minister.nbSessions < minister.maxSessionsPerWeek) {
                  minister.nbSessions += 1;
                  day.invited.push({ name: minister.name, party: minister.party });
                }
              }
              if (day.invited.length < minMinistersPerSession) {
                error = 'MINISTERS_PER_SESSION';
              }
              for (let i = 0, len = requiredParties.length; i < len && !error; i += 1) {
                let found = false;
                for (let key in ministers) {
                  let minister = ministers[key];
                  let party = requiredParties[i];
                  if (minister.party === party) {
                    found = true;
                    break;
                  }
                }
                if (!found) {
                  error = 'PARTY_REPRESENTATION_BALANCE';
                }
              }
            }
            if (error) {
              res.statueCode = 200;
              res.write(JSON.stringify({
                error: `Could not satisfy the ${error} rule`,
                details: {
                  days,
                  ministers,
                  requiredParties,
                  minMinistersPerSession,
                },
              }, null, 2));
              return res.end();
            }

            for (let key in ministers) {
              let minister = ministers[key];
              if (minister.nbSessions < minister.minSessionsPerWeek) {
                error = 'MIN_SESSIONS_PER_WEEK';
                break;
              }
            }
            if (error) {
              res.statusCode = 200;
              res.write(JSON.stringify({
                error: 'Could not satisfy the MIN_SESSIONS_PER_WEEK rule',
                details: {
                  days,
                  ministers,
                },
              }, null, 2));
              return res.end()
            } else {
              res.statusCode = 200;

              // TODO Remove pretty
              res.write(JSON.stringify(days, null, 2));
              return res.end();
            }
          }
        }
      })

      // FIXME: Rename when burp is renamed
      .catch((reason) => {
        console.log('ERROR', reason);
        res.statusCode = 500;
        res.write(reason.stack || reason.toString());
        return res.end();
      });
  };
};
