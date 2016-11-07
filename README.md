# waltz-weekly-attendance

## Installation

```sh
git clone git@github.com:shawninder/waltz-weekly-attendance.git
cd waltz-weekly-attendance
npm install
```

## Launching the service

```sh
npm start
```
Launches the service on $PORT, if provided, or any random open port otherwise

## Deploying the service

```sh
# npm install -g now
now
```

## data

All the data is obtained from the following API: http://interview-api.waltzlabs.com/api/v1
It is re-fetched on every single request intentionally to make sure each request is answered using the latest available data.

#### Dates

This service supposes the dates provided are correctly parsed by [`Date.parse`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse) and that they are all given in UTC.
