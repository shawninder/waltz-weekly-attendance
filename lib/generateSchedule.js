'use strict';

const makeRuleError = require('./makeRuleError');
const add = function add(minister, day) {
  minister.nbSessions += 1;
  day.invited.push({
    name: minister.name,
    party: minister.party,
  });
};

module.exports = function generateSchedule({ days, ministers, parties, vals }) {
  const nbDays = days.length;
  const ministerIds = Object.keys(ministers);
  const nbMinisters = ministerIds.length;
  const nbRequiredParties = vals.requiredParties.length;

  // For each day
  for (let dayI = 0; dayI < nbDays; dayI += 1) {
    const ministersAssigned = {};
    const day = days[dayI];
    let dayOff = false;

    // Make sure each required party is represented (throw if impossible)
    for (let partyI = 0; partyI < nbRequiredParties; partyI += 1) {
      const party = vals.requiredParties[partyI];
      const reps = parties[party];
      const nbReps = reps.length;
      let found = false;

      for (let repI = 0; repI < nbReps && !found; repI += 1) {
        const rep = ministers[reps[repI]];

        if (rep.nbSessions < rep.maxSessionsPerWeek && !ministersAssigned[rep.id]) {
          found = true;
          add(rep, day);
          ministersAssigned[rep.id] = true;
        }
      }
      if (!found) {
        dayOff = true;
      }
    }

    if (!dayOff) {
      // For each unassigned minister
      for (let ministerI = 0; ministerI < nbMinisters; ministerI += 1) {
        const minister = ministers[ministerIds[ministerI]];

        // Assign him if he is available
        if (!ministersAssigned[minister.id] && minister.nbSessions < minister.maxSessionsPerWeek) {
          add(minister, day);
          ministersAssigned[minister.id] = true;
        }
      }

      // Make sure enough ministers are invited
      if (day.invited.length < vals.minMinistersPerSession) {
        throw makeRuleError('MINISTERS_PER_SESSION');
      }
    }
  }

  // Make sure every minister is assigned his assigned minimum number of sessions
  for (let i = 0; i < nbMinisters; i += 1) {
    const minister = ministers[ministerIds[i]];

    if (minister.nbSessions < minister.minSessionsPerWeek) {
      throw makeRuleError('MIN_SESSIONS_PER_WEEK');
    }
  }

  // We have a valid schedule!
  return days;
};
