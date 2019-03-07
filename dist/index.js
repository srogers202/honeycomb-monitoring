"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const libhoney_1 = require("libhoney");
const moment = require("moment");
var EventTypes;
(function (EventTypes) {
    EventTypes["API"] = "Api";
    EventTypes["API_ERROR"] = "ApiError";
    EventTypes["ERROR"] = "Error";
    EventTypes["DURATION"] = "Duration";
    EventTypes["GENERIC"] = "Generic";
    EventTypes["INTERVAL_COUNT"] = "IntervalCount";
})(EventTypes || (EventTypes = {}));
var Intervals;
(function (Intervals) {
    Intervals["minute"] = "minute";
    Intervals["hourly"] = "hourly";
    Intervals["daily"] = "daily";
})(Intervals = exports.Intervals || (exports.Intervals = {}));
class Monitor {
    constructor(writeKey, dataset, enabled) {
        this.initializeHoney(writeKey, dataset, enabled);
        this.events = {};
    }
    /**
     * Middleware used to report response time and errors for an express API.
     */
    responseTimeMiddleware(sanitzePath) {
        const onHeaders = require('on-headers');
        return (req, res, next) => {
            let path = req.path || req.originalUrl;
            if (path) {
                path = sanitzePath ? sanitzePath(path) : path;
                this.reportDurationStart(path);
                const _this = this;
                // onHeaders will be called before response headers are sent
                onHeaders(res, function () {
                    const statusCode = this.statusCode || 200;
                    if (statusCode > 399) {
                        _this.reportError(path, statusCode, EventTypes.API_ERROR);
                    }
                    else {
                        _this.reportDurationEnd(path, EventTypes.API);
                    }
                });
            }
            next();
        };
    }
    /**
     * Report an error. If a start time was logged, report the duration from start until
     * the error was detected.
     *
     * @param name
     * @param error
     */
    reportError(name, error, type = EventTypes.ERROR) {
        const event = this.events[name];
        const start = event && event.start;
        let duration = undefined;
        // Check for a start time and log duration
        if (start) {
            duration = this.now() - start;
        }
        let err = error;
        if (err && typeof err === 'object') {
            err = JSON.stringify(err);
        }
        this.honey.sendNow({
            name,
            type,
            duration,
            error: err,
        });
    }
    /**
     * Report a generic event (no time or duration)
     *
     * @param name
     */
    reportGenericEvent(name) {
        this.honey.sendNow({
            name,
            type: EventTypes.GENERIC,
        });
    }
    /**
     * This is called when an event starts. Nothing is logged to HC until
     * _reportDurationEnd_ is called.
     *
     * @param name
     */
    reportDurationStart(name) {
        this.events[name] = { start: this.now() };
    }
    /**
     * Complete the logging of a duration event. The _name_ must match the name passed to
     * _reportDurationStart_.
     *
     * @param name
     */
    reportDurationEnd(name, type = EventTypes.DURATION) {
        const event = this.events[name];
        const start = event && event.start;
        if (start) {
            const end = this.now();
            const duration = end - start;
            this.honey.sendNow({
                name,
                type,
                duration,
            });
        }
    }
    /**
     * Report the number of items processed over an interval
     *
     * @param name
     * @param count
     * @param interval
     */
    reportIntervalCount(name, count, interval) {
        this.honey.sendNow({
            name,
            type: EventTypes.INTERVAL_COUNT,
            interval,
            count,
        });
    }
    initializeHoney(writeKey, dataset, enabled) {
        this.honey = new libhoney_1.default({
            writeKey,
            dataset,
            disabled: !enabled,
        });
    }
    now() {
        return moment().utc().valueOf();
    }
}
exports.default = Monitor;
