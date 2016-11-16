'use strict';

module.exports = exports = {
  '/': {
    links: {
      holidays: 'http://localhost:3001/holidays',
      ministers: 'http://localhost:3001/ministers',
      ruleDefinitions: 'http://localhost:3001/rule-definitions',
      rules: 'http://localhost:3001/rules',
      serverTime: 'http://localhost:3001/server-time',
      timeOffRequests: 'http://localhost:3001/time-off-requests',
      weeks: 'http://localhost:3001/weeks',
    },
  },
  '/holidays': [
    {
      date: '2017-05-22',
      name: 'Victoria Day',
    },
    {
      date: '2017-04-14',
      name: 'Good Friday',
    },
    {
      date: '2017-10-09',
      name: 'Thanksgiving Day',
    },
    {
      date: '2017-07-01',
      name: 'Canada Day',
    },
    {
      date: '2017-06-24',
      name: 'Jean Baptise Day',
    },
    {
      date: '2016-11-11',
      name: 'Remembrance Day',
    },
    {
      date: '2016-12-25',
      name: 'Christmas Day',
    },
    {
      date: '2017-09-04',
      name: 'Labour Day',
    },
    {
      date: '2017-01-01',
      name: "New Year's Day",
    },
  ],
  '/ministers': [
    {
      id: 2,
      name: 'Rona Ambrose (interim)',
      party: 'Conservative',
    },
    {
      id: 1,
      name: 'Justin Trudeau',
      party: 'Liberal',
    },
    {
      id: 3,
      name: 'Thomas Mulcair',
      party: 'NDP',
    },
    {
      id: 4,
      name: 'Rhéal Fortin (interim)',
      party: 'Bloc Québécois',
    },
    {
      id: 5,
      name: 'Elizabeth May',
      party: 'Green',
    },
  ],
  '/rule-definitions': [
    {
      id: 8,
      value: 'MAX_SESSIONS_BY_AVAILABILITY',
      description: 'The minister specified by this rule should have as many sessions per week allocated to them as their availability permits, up-to their maximum weekly session allowance.',
    },
    {
      id: 12,
      value: 'PARTY_REPRESENTATION_BALANCE',
      description: 'All shifts must be covered by a minister from one or more of the parties specified.',
    },
    {
      id: 4,
      value: 'MIN_SESSIONS_PER_WEEK',
      description: 'Minimum number of sessions a minister must attend per week. If minister_id is included then this applies to that minister only. If the week contains a holiday this value may be subtracted by the number of holidays in the week.',
    },
    {
      id: 2,
      value: 'MAX_SESSIONS_PER_WEEK',
      description: 'Maximum number of sessions a minister may attend per week. If minister_id is included then this applies to that minister only.',
    },
    {
      id: 1,
      value: 'MINISTERS_PER_SESSION',
      description: 'Number of ministers required per session.',
    },
  ],
  '/rules': [
    {
      rule_id: 8,
      minister_id: 2,
    },
    {
      rule_id: 2,
      minister_id: [1, 2],
      value: 5,
    },
    {
      rule_id: 4,
      minister_id: 2,
      value: 4,
    },
    {
      rule_id: 2,
      value: 3,
    },
    {
      rule_id: 8,
      minister_id: 1,
    },
    {
      rule_id: 2,
      minister_id: 5,
      value: 2,
    },
    {
      rule_id: 12,
      value: ['Liberal', 'Conservative'],
    },
    {
      rule_id: 4,
      value: 3,
    },
    {
      rule_id: 7,
      value: 3,
    },
    {
      rule_id: 4,
      minister_id: [5, 4],
      value: 1,
    }
  ],
  '/server-time': { serverTime: 'Fri, 04 Nov 2016 19:48:10 GMT' },
  '/time-off-requests': [
    {
      minister_id: 2,
      week: 6,
      days: [1]
    },
    {
      minister_id: 3,
      week: 7,
      days: [4]
    },
    {
      minister_id: 1,
      week: 5,
      days: [1, 2]
    },
    {
      minister_id: 2,
      week: 5,
      days: [5]
    },
    {
      minister_id: 4,
      week: 6,
      days: [1, 3]
    },
    {
      minister_id: 1,
      week: 6,
      days: [5]
    },
    {
      minister_id: 5,
      week: 7,
      days: [2]
    },
    {
      minister_id: 1,
      week: 8,
      days: [5]
    },
    {
      minister_id: 5,
      week: 6,
      days: [2, 5]
    },
    {
      minister_id: 2,
      week: 8,
      days: [1]
    },
    {
      minister_id: 4,
      week: 5,
      days: [1, 3]
    },
    {
      minister_id: 3,
      week: 8,
      days: [2, 3, 4]
    },
    {
      minister_id: 4,
      week: 8,
      days: [1, 3]
    },
    {
      minister_id: 5,
      week: 8,
      days: [2, 5]
    },
    {
      minister_id: 2,
      week: 7,
      days: [5]
    },
    {
      minister_id: 5,
      week: 5,
      days: [2, 5]
    },
    {
      minister_id: 4,
      week: 7,
      days: [1, 3]
    },
    {
      minister_ids: [1, 2, 3, 4, 5],
      week: 16,
      days: [1, 2, 3, 4, 5]
    },
    {
      minister_id: 1,
      week: 7,
      days: [1, 2]
    },
    {
      minister_ids: [1, 2, 3, 4, 5],
      week: 17,
      days: [1, 2, 3, 4, 5]
    }
  ],
  '/weeks': [
    {
      week: 1,
      start: 'Mon, 05 Sep 2016',
      end: 'Sat, 10 Sep 2016',
      expected: { length: 6 },
    },
    {
      week: 2,
      start: 'Mon, 12 Sep 2016',
      end: 'Sat, 17 Sep 2016',
      expected: { length: 6 },
    },
    {
      week: 3,
      start: '2016-09-19',
      end: '2016-09-24',
      expected: { length: 6 },
    },
    {
      week: 4,
      start: 'Mon, 26 Sep 2016',
      end: 'Sat, 01 Oct 2016',
      expected: { length: 6 },
    },
    {
      week: 5,
      start: '2016-10-03',
      end: '2016-10-08',
      expected: { length: 6 },
    },
    {
      week: 6,
      start: 'Mon, 10 Oct 2016',
      end: 'Sat, 15 Oct 2016',
      expected: { length: 6 },
    },
    {
      week: 7,
      start: 'Mon, 17 Oct 2016',
      end: 'Sat, 22 Oct 2016',
      expected: { length: 6 },
    },
    {
      week: 8,
      start: 'Sun Oct 23 2016',
      end: 'Fri Oct 28 2016',
      expected: { length: 6 },
    },
    {
      week: 9,
      start: 'Mon, 31 Oct 2016',
      end: 'Sat, 05 Nov 2016',
      expected: { length: 6 },
    },
    {
      week: 10,
      start: '2016-11-07',
      end: '2016-11-12',
      expected: { length: 5 },
    },
    {
      week: 11,
      start: 'Mon, 14 Nov 2016',
      end: 'Sat, 19 Nov 2016',
      expected: { length: 6 },
    },
    {
      week: 12,
      start: 'Sun Nov 20 2016',
      end: 'Fri Nov 25 2016',
      expected: { length: 6 },
    },
    {
      week: 13,
      start: '2016-11-28',
      end: '2016-12-03',
      expected: { length: 6 },
    },
    {
      week: 14,
      start: '2016-12-05',
      end: '2016-12-10',
      expected: { length: 6 },
    },
    {
      week: 15,
      start: 'Sun Dec 11 2016',
      end: 'Fri Dec 16 2016',
      expected: { length: 6 },
    },
    {
      week: 16,
      start: '2016-12-19',
      end: '2016-12-24',
      expected: { length: 6 },
    },
    {
      week: 17,
      start: 'Sun Dec 25 2016',
      end: 'Fri Dec 30 2016',
      expected: { length: 5 },
    },
    {
      week: 18,
      start: 'Mon, 02 Jan 2017',
      end: 'Sat, 07 Jan 2017',
      expected: { length: 6 },
    },
    {
      week: 19,
      start: 'Sun Jan 08 2017',
      end: 'Fri Jan 13 2017',
      expected: { length: 6 },
    },
    {
      week: 20,
      start: 'Sun Jan 15 2017',
      end: 'Fri Jan 20 2017',
      expected: { length: 6 },
    },
    {
      week: 21,
      start: 'Sun Jan 22 2017',
      end: 'Fri Jan 27 2017',
      expected: { length: 6 },
    },
    {
      week: 22,
      start: 'Mon, 30 Jan 2017',
      end: 'Sat, 04 Feb 2017',
      expected: { length: 6 },
    },
    {
      week: 23,
      start: 'Sun Feb 05 2017',
      end: 'Fri Feb 10 2017',
      expected: { length: 6 },
    },
    {
      week: 24,
      start: 'Mon, 13 Feb 2017',
      end: 'Sat, 18 Feb 2017',
      expected: { length: 6 },
    },
    {
      week: 25,
      start: '2017-02-20',
      end: '2017-02-25',
      expected: { length: 6 },
    },
    {
      week: 26,
      start: '2017-02-27',
      end: '2017-03-04',
      expected: { length: 6 },
    },
    {
      week: 27,
      start: 'Mon, 06 Mar 2017',
      end: 'Sat, 11 Mar 2017',
      expected: { length: 6 },
    },
    {
      week: 28,
      start: '2017-03-13',
      end: '2017-03-18',
      expected: { length: 6 },
    },
    {
      week: 29,
      start: 'Mon, 20 Mar 2017',
      end: 'Sat, 25 Mar 2017',
      expected: { length: 6 },
    },
    {
      week: 30,
      start: '2017-03-27',
      end: '2017-04-01',
      expected: { length: 6 },
    },
    {
      week: 31,
      start: 'Sun Apr 02 2017',
      end: 'Fri Apr 07 2017',
      expected: { length: 6 },
    },
    {
      week: 32,
      start: 'Sun Apr 09 2017',
      end: 'Fri Apr 14 2017',
      expected: { length: 5 },
    },
    {
      week: 33,
      start: 'Sun Apr 16 2017',
      end: 'Fri Apr 21 2017',
      expected: { length: 6 },
    },
    {
      week: 34,
      start: '2017-04-24',
      end: '2017-04-29',
      expected: { length: 6 },
    },
    {
      week: 35,
      start: 'Sun Apr 30 2017',
      end: 'Fri May 05 2017',
      expected: { length: 6 },
    },
    {
      week: 36,
      start: 'Sun May 07 2017',
      end: 'Fri May 12 2017',
      expected: { length: 6 },
    },
    {
      week: 37,
      start: '2017-05-15',
      end: '2017-05-20',
      expected: { length: 6 },
    },
    {
      week: 38,
      start: '2017-05-22',
      end: '2017-05-27',
      expected: { length: 5 },
    }
  ],
  '/favicon': {}
};

