import 'jest';
import Honey from 'libhoney';

import Monitor from './index';
import { Intervals } from './index';

jest.mock('libhoney');

const writeKey = 'sample-write-key';
const dataset = 'sample-dataset';
const enabled = false;
const eventName = 'sample-event-name';

describe('keap-node-monitoring', () => {
  beforeEach(() => {
    Honey.mockClear();
  });

  it('should export a class', () => {
    expect(Monitor).toBeDefined();
  });

  describe('initialization', () => {
    let monitor;

    beforeEach(() => {
      monitor = new Monitor(writeKey, dataset, enabled);
    });

    it('should initialize a Honey object', () => {
      expect(monitor.honey).toBeDefined();
      expect(Honey).toHaveBeenCalledTimes(1);
      expect(Honey).toHaveBeenCalledWith({
        writeKey,
        dataset,
        disabled: !enabled,
      });
    });
  });

  describe('reporting', () => {
    let monitor;
    let sendNow;

    beforeEach(() => {
      monitor = new Monitor(writeKey, dataset, enabled);
      sendNow = jest.fn();
      monitor.honey = {
        sendNow,
      };
    });

    describe('reportError', () => {
      const error = 'oh no';

      describe('with a start event', () => {
        beforeEach(async () => {
          monitor.reportDurationStart(eventName);
          await new Promise((res) => setTimeout(res, 10));
        });

        it('should report the duration', () => {
          monitor.reportError(eventName, error);

          expect(sendNow).toHaveBeenCalledTimes(1);
          expect(sendNow).toHaveBeenCalledWith({
            name: eventName,
            type: 'Error',
            duration: expect.any(Number),
            error,
          });
        });
      });

      describe('without a start event', () => {
        it('should NOT report the duration', () => {
          monitor.reportError(eventName, error);

          expect(sendNow).toHaveBeenCalledTimes(1);
          expect(sendNow).toHaveBeenCalledWith({
            name: eventName,
            type: 'Error',
            duration: undefined,
            error,
          });
        });
      });
    });

    describe('reportGenericEvent', () => {
      it('should report the event', () => {
        monitor.reportGenericEvent(eventName);

        expect(sendNow).toHaveBeenCalledTimes(1);
        expect(sendNow).toHaveBeenCalledWith({
          name: eventName,
          type: 'Generic',
        });
      });
    });

    describe('reportDurationEnd', () => {
      describe('with a start event', () => {
        beforeEach(async () => {
          monitor.reportDurationStart(eventName);
          await new Promise((res) => setTimeout(res, 10));
        });

        it('should report the duration', () => {
          monitor.reportDurationEnd(eventName);

          expect(sendNow).toHaveBeenCalledTimes(1);
          expect(sendNow).toHaveBeenCalledWith({
            name: eventName,
            type: 'Duration',
            duration: expect.any(Number),
          });
        });
      });

      describe('without a start event', () => {
        it('should NOT report', () => {
          monitor.reportDurationEnd(eventName);

          expect(sendNow).not.toHaveBeenCalled();
        });
      });
    });

    describe('reportIntervalCount', () => {
      it('should report the event', () => {
        monitor.reportIntervalCount(eventName, 100, Intervals.hourly);

        expect(sendNow).toHaveBeenCalledTimes(1);
        expect(sendNow).toHaveBeenCalledWith({
          name: eventName,
          type: 'IntervalCount',
          count: 100,
          interval: Intervals.hourly,
        });
      });
    });
  });
});
