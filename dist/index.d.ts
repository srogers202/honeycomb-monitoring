declare enum EventTypes {
    API = "Api",
    API_ERROR = "ApiError",
    ERROR = "Error",
    DURATION = "Duration",
    GENERIC = "Generic",
    INTERVAL_COUNT = "IntervalCount"
}
export declare enum Intervals {
    minute = "minute",
    hourly = "hourly",
    daily = "daily"
}
declare class Monitor {
    constructor(writeKey: string, dataset: string, enabled?: boolean);
    /**
     * Middleware used to report response time and errors for an express API.
     */
    responseTimeMiddleware(sanitzePath?: (path: string) => string): (req: any, res: any, next: any) => void;
    /**
     * Report an error. If a start time was logged, report the duration from start until
     * the error was detected.
     *
     * @param name
     * @param error
     */
    reportError(name: string, error: any, type?: EventTypes): void;
    /**
     * Report a generic event (no time or duration)
     *
     * @param name
     */
    reportGenericEvent(name: string): void;
    /**
     * This is called when an event starts. Nothing is logged to HC until
     * _reportDurationEnd_ is called.
     *
     * @param name
     */
    reportDurationStart(name: string): void;
    /**
     * Complete the logging of a duration event. The _name_ must match the name passed to
     * _reportDurationStart_.
     *
     * @param name
     */
    reportDurationEnd(name: string, type?: EventTypes): void;
    /**
     * Report the number of items processed over an interval
     *
     * @param name
     * @param count
     * @param interval
     */
    reportIntervalCount(name: string, count: number, interval: Intervals): void;
    private honey;
    private events;
    private initializeHoney;
    private now;
}
export default Monitor;
