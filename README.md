# waltz-weekly-attendance

### Warning

This is a programming exercise not meant for production use. See issues for the most egregious bugs and missing features :)

## Installation

```sh
git clone git@github.com:shawninder/waltz-weekly-attendance.git
cd waltz-weekly-attendance
npm install
```

## Launch

```sh
npm start
```
Launches the service on $PORT, if provided, or any random open port otherwise.

This service attempts to behave as indicated in [the instructions](http://interview-api.waltzlabs.com/). The response JSON in the case of a success will look like this:

```json
[{
  "date": "ddd, MM dd yyyy",
  "invited": [{
    "name": "Minister name",
    "party": "Minister party"
  }]
}]
```

In the case of an error, the response will be a JSON object with an `error` field.

## Deploy

```sh
# npm install -g now
now
```
See [nowjs](https://zeit.co/now).

## Data

All the data is obtained from the following API: http://interview-api.waltzlabs.com/api/v1
It is re-fetched on every single request intentionally to make sure each request is answered using the latest available data.

#### Dates

This service supposes the dates provided are correctly parsed by [`Date.parse`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse) and that they are all given in UTC (which seems to be the case as of this writing)

## Tests

```sh
npm test
```

Use `npm run test-dev` to watch source code and automatically re-run tests when it changes (using nodemon: `npm i -g nodemon`).

## Development

```sh
npm run dev
```

This is the same as `npm start`, except it watches the source files and re-launches if they change (using nodemon: `npm i -g nodemon`).

#### Known problems

See this repo's issues
