'use strict';

module.exports = function parseRules(rules, ministers, skip) {
  const ministerIds = Object.keys(ministers);
  const nbMinisters = ministerIds.length;
  const vals = {
    requiredParties: null,
    minMinistersPerSession: 0,
  };

  for (let i = 0, len = rules.length; i < len; i += 1) {
    const rule = rules[i];

    switch (rule.rule_id) {
      case 1:
        vals.minMinistersPerSession = rule.value;
        break;
      case 2: {
        const ids = rule.minister_id;
        const value = rule.value;

        if (!ids) {
          for (let j = 0; j < nbMinisters; j += 1) {
            const item = ministers[ministerIds[j]];

            if (!item.maxSessionsPerWeek) {
              item.maxSessionsPerWeek = value;
            }
          }
        } else if (Array.isArray(ids)) {
          for (let j = 0, length = ids.length; j < length; j += 1) {
            ministers[ids[j]].maxSessionsPerWeek = value;
          }
        } else {
          ministers[ids].maxSessionsPerWeek = value;
        }
        break;
      }
      case 4: {
        const ids = rule.minister_id;
        let value = rule.value - skip.length;

        if (value < 0) {
          value = 0;
        }
        if (!ids) {
          for (let j = 0; j < nbMinisters; j += 1) {
            const item = ministers[ministerIds[j]];

            if (!item.minSessionsPerWeek) {
              item.minSessionsPerWeek = value;
            }
          }
        } else if (Array.isArray(ids)) {
          for (let j = 0, length = ids.length; j < length; j += 1) {
            ministers[ids[j]].minSessionsPerWeek = value;
          }
        } else {
          ministers[ids].minSessionsPerWeek = value;
        }
        break;
      }
      case 8: {
        const ids = rule.minister_id;

        if (!ids) {
          for (let j = 0; j < nbMinisters; j += 1) {
            ministers[ministerIds[j]].forceMax = true;
          }
        } else if (Array.isArray(ids)) {
          for (let j = 0, length = ids.length; j < length; j += 1) {
            ministers[ids[j]].forceMax = true;
          }
        } else {
          ministers[ids].forceMax = true;
        }
        break;
      }
      case 12:
        vals.requiredParties = rule.value;
        break;
      default:
        // TODO: This should send a warning to an admin
        console.log('Unknown rule', rule, 'ignoring');
        break;
    }
  }

  return vals;
};
