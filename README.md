# keap-node-monitoring
JS SDK to send performance and monitoring markers to HoneyComb in a consistent way.

## What should I monitor?

### Questions to ask yourself about your service

- What does my service look like when it's healthy? What are some indicators that everything is working as expected?
  - Examples:
    - API endpoint requests are returning 200
    - API endpoint requests are returning in a reasonable time
    - A certain number of requests/events are happening every 30m.
    - The number of errors is below a certain threshhold
  
- What does my service do?
  - A service might have a REST API interface, as well as Pub/Sub subscriptions, scheduled cron tasks, etc.
  - Consider all functions of a service when describing what a healthy service looks like.


### Make a plan

#### List the different markers that would be useful in determining if your service is healthy.

Example

| Marker |  What am I measuring? |
|---|---|
| API request duration | The response time of every API request |
| Number of API requests | The number of requests over a given period of time |
| Number of data items processed | The total number of items processed per cron job |
| Number and type of response error | The number of response errors with a status code (400-5XX) |

### Create documentation of the measurements

TODO

### Implement Markers

TODO

### Create a dashboard and triggers in Honey Comb

TODO

## Installation 
```sh
npm install git+ssh://git@github.com/infusionsoft/keap-node-monitoring
yarn add git+ssh://git@github.com/infusionsoft/keap-node-monitoring
```

## Usage


### Initialization
```typescript
import Monitor from 'keap-node-monitoring';

const writeKey = 'XX-HONEY-COMB-WRITE-KEY-XX';
const dataset = 'sample-dataset';

const monitor = Monitor(writeKey, dataset, true);
```

### Reporting

```typescript
// Generic event
monitor.reportGenericEvent('event-name');

// Error
monitor.reportError('event-name', new Error('uh oh'));
monitor.reportError('event-name', '401');
monitor.reportError('event-name', { error: 'danger' });

// Duration
monitor.reportDurationStart('event-name');
/** some code **/
monitor.reportDurationEnd('event-name');

// Number of events/items per interval
monitor.reportIntervalCount('event-name', 100, Interval.minute);
```

### API Middleware

```typescript
app.use(monitor.responseTimeMiddleware());
```

## Development

### Testing
```sh
yarn test
```

### Building
```sh
yarn build
```
