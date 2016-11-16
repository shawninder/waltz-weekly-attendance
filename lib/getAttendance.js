'use strict';

const seeReadme = require('./seeReadme');
const time = require('./time');
const generateSchedule = require('./generateSchedule');
const makeRuleError = require('./makeRuleError');

const makeMinistersMap = function makeMinistersMap(originalMinisters) {
  const ministers = {};
  const parties = {};

  for (let i = 0, len = originalMinisters.length; i < len; i += 1) {
    const item = originalMinisters[i];

    if (!parties[item.party]) {
      parties[item.party] = [];
    }
    parties[item.party].push(item.id);
    item.nbSessions = 0;
    ministers[item.id] = item;
    delete ministers[item.id].id;
  }

  return {
    ministers,
    parties,
  };
};

const parseRules = require('./parseRules');

module.exports = function getAttendanceFactory(server) {
  return function getAttendance(req, res) {
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

            return finish(400, `Bad Request: requested week doesn't exist, ${seeReadme}`);
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
      .then(([week,
        holidays,
        originalMinisters,
        rules,
      ]) => {
        if (!cancelled) {
          const { days, skip } = time.getDays(week, holidays);

          if (days.length === 0) {
            return finish(200, '[]');
          }
          const { ministers, parties } = makeMinistersMap(originalMinisters);
          const vals = parseRules(rules, ministers, skip);

          try {
            // Let's make sure we have at least one minister per required party, otherwise the PARTY_REPRESENTATION_BALANCE rule is impossible to respect
            for (let i = 0, len = vals.requiredParties.length; i < len; i += 1) {
              if (!parties[vals.requiredParties[i]] || parties[vals.requiredParties[i]].length <= 0) {
                throw makeRuleError('PARTY_REPRESENTATION_BALANCE');
              }
            }

            const schedule = generateSchedule({
              days,
              ministers,
              vals
            });

            return finish(200, JSON.stringify(schedule));
          } catch (ex) {
            if (ex.rule) {
              return finish(200, JSON.stringify({
                error: `Could not satisfy the ${ex.rule} rule`,
                details: {
                  days,
                  ministers,
                  requiredParties: vals.requiredParties,
                  minMinistersPerSession: vals.minMinistersPerSession,
                },
              }, null, 2));
            }
            throw ex;
          }
        }
      })
      .catch((reason) => {
        console.error('Unexpected error', reason);

        return finish(500, reason.stack || reason.toString());
      });
  };
};
