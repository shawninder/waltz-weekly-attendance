'use strict';

const makeRuleError = require('./makeRuleError');

module.exports = function generateSchedule({ days, ministers, vals }) {
  const ministerIds = Object.keys(ministers);
  const nbMinisters = ministerIds.length;

  for (let i = 0, len = days.length; i < len; i += 1) {
    const day = days[i];

    for (let j = 0; j < nbMinisters; j += 1) {
      const minister = ministers[ministerIds[j]];

      if (minister.nbSessions < minister.maxSessionsPerWeek) {
        minister.nbSessions += 1;
        day.invited.push({
          name: minister.name,
          party: minister.party,
        });
      }
    }
    if (day.invited.length < vals.minMinistersPerSession) {
      throw makeRuleError('MINISTERS_PER_SESSION');
    }
    for (let j = 0, length = vals.requiredParties.length; j < length; j += 1) {
      let found = false;

      for (let k = 0; k < nbMinisters; k += 1) {
        const minister = ministers[ministerIds[k]];
        const party = vals.requiredParties[j];

        if (minister.party === party) {
          found = true;
          break;
        }
      }
      if (!found) {
        throw makeRuleError('PARTY_REPRESENTATION_BALANCE');
      }
    }
  }

  for (let i = 0; i < nbMinisters; i += 1) {
    const minister = ministers[ministerIds[i]];

    if (minister.nbSessions < minister.minSessionsPerWeek) {
      throw makeRuleError('MIN_SESSIONS_PER_WEEK');
    }
  }

  return days;
};
