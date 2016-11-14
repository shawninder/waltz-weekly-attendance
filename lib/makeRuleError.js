'use strict';

module.exports = function makeRuleError(rule) {
  const error = new Error('Rule not respected');

  error.rule = rule;

  return error;
};
