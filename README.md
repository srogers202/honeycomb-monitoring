# Honeycomb Monitoring
JS SDK to send performance and monitoring markers to HoneyComb in a consistent way.

## Installation 
```sh
npm install honeycomb-monitoring

yarn add honeycomb-monitoring
```

## Usage

### Initialization
```typescript
import Monitor from 'honeycomb-monitoring';

const writeKey = 'XX-HONEY-COMB-WRITE-KEY-XX';
const dataset = 'sample-dataset';
const enabled = process.ENV === 'prod'

const monitor = Monitor(writeKey, dataset, enabled);
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
