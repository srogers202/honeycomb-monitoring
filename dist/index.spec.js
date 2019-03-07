"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const libhoney_1 = require("libhoney");
const index_1 = require("./index");
const index_2 = require("./index");
jest.mock('libhoney');
const writeKey = 'sample-write-key';
const dataset = 'sample-dataset';
const enabled = false;
const eventName = 'sample-event-name';
describe('keap-node-monitoring', () => {
    beforeEach(() => {
        libhoney_1.default.mockClear();
    });
    it('should export a class', () => {
        expect(index_1.default).toBeDefined();
    });
    describe('initialization', () => {
        let monitor;
        beforeEach(() => {
            monitor = new index_1.default(writeKey, dataset, enabled);
        });
        it('should initialize a Honey object', () => {
            expect(monitor.honey).toBeDefined();
            expect(libhoney_1.default).toHaveBeenCalledTimes(1);
            expect(libhoney_1.default).toHaveBeenCalledWith({
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
            monitor = new index_1.default(writeKey, dataset, enabled);
            sendNow = jest.fn();
            monitor.honey = {
                sendNow,
            };
        });
        describe('reportError', () => {
            const error = 'oh no';
            describe('with a start event', () => {
                beforeEach(() => __awaiter(this, void 0, void 0, function* () {
                    monitor.reportDurationStart(eventName);
                    yield new Promise((res) => setTimeout(res, 10));
                }));
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
                beforeEach(() => __awaiter(this, void 0, void 0, function* () {
                    monitor.reportDurationStart(eventName);
                    yield new Promise((res) => setTimeout(res, 10));
                }));
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
                monitor.reportIntervalCount(eventName, 100, index_2.Intervals.hourly);
                expect(sendNow).toHaveBeenCalledTimes(1);
                expect(sendNow).toHaveBeenCalledWith({
                    name: eventName,
                    type: 'IntervalCount',
                    count: 100,
                    interval: index_2.Intervals.hourly,
                });
            });
        });
    });
});
