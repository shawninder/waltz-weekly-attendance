'use strict';

const XDate = require('xdate');
const seeReadme = require('./seeReadme');
const time = require('./time');

const makeMinistersMap = function makeMinistersMap(originalMinisters) {
  var ministers = {};
  for (let i = 0, len = originalMinisters.length; i < len; i += 1) {
    let item = originalMinisters[i];
    item.nbSessions = 0;
    ministers[item.id] = item;
    delete ministers[item.id].id;
  }
  return ministers;
};

const parseRules = require('./parseRules');

module.exports = exports = function getAttendanceFactory(server) {
  return function getAttendance(req, res, next) {
    const finish = function finish(statusCode, data) {
      res.statusCode = statusCode;
      res.write(data);
      return res.end();
    };
    let cancelled = false;
    const catchGet = function catchGet(err) {
      if (!cancelled) {
        cancelled = true;
        console.error(`Can't get ${err.getting}: ${err}. Make sure the apiURL option is correctly set and that the designated server is running and responding as expected. For more info, ${seeReadme}`);
        return finish(500, 'Try again later');
      }
    };
    Promise.all([
      server.get('weeks')
        .catch(catchGet)
        .then((weeks) => {
          // Can we find requested week in data?
          let found = false;
          for (let i = 0, len = weeks.length; !found && i < len; i += 1) {
            if (weeks[i].week === req.week) {
              found = weeks[i];
            }
          }

          if (!found && !cancelled) {
            cancelled = true;
            return finish(400, "Bad Request: requested week doesn't exist, " + seeReadme);
          }
          return found;
        }),
      server.get('holidays')
        .catch(catchGet),
      server.get('ministers')
        .catch(catchGet),
      server.get('rules')
        .catch(catchGet),
    ])
      .then(([week, holidays, originalMinisters, rules]) => {
        if (!cancelled) {
          let { days, skip } = time.getDays(week, holidays);
          if (days.length === 0) {
            return finish(200, '[]');
          }
          let ministers = makeMinistersMap(originalMinisters);
          let vals = parseRules(rules, ministers, skip);

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
            if (day.invited.length < vals.minMinistersPerSession) {
              error = 'MINISTERS_PER_SESSION';
            }
            for (let i = 0, len = vals.requiredParties.length; i < len && !error; i += 1) {
              let found = false;
              for (let key in ministers) {
                let minister = ministers[key];
                let party = vals.requiredParties[i];
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
            return finish(200, JSON.stringify({
              error: `Could not satisfy the ${error} rule`,
              details: {
                days,
                ministers,
                requiredParties: vals.requiredParties,
                minMinistersPerSession: vals.minMinistersPerSession,
              },
            }, null, 2));
          }

          for (let key in ministers) {
            let minister = ministers[key];
            if (minister.nbSessions < minister.minSessionsPerWeek) {
              error = 'MIN_SESSIONS_PER_WEEK';
              break;
            }
          }
          if (error) {
            return finish(200, JSON.stringify({
              error: 'Could not satisfy the MIN_SESSIONS_PER_WEEK rule',
              details: {
                days,
                ministers,
              },
            }, null, 2));
          }
          return finish(200, JSON.stringify(days));
        }
      })
      .catch((reason) => {
        console.log('ERROR', reason);
        return finish(500, reason.stack || reason.toString());
      });
  };
};
