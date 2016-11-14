'use strict';

module.exports = exports = function parseRules(rules, ministers, skip) {
  let vals = {
    requiredParties: null,
    minMinistersPerSession: 0,
  };
  for (let i = 0, len = rules.length; i < len; i += 1) {
    let rule = rules[i];
    switch (rule.rule_id) {
      case 1:
        vals.minMinistersPerSession = rule.value;
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