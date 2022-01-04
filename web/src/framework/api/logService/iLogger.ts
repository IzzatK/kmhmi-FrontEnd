import {LogLevel} from "./logLevel";

export interface ILogger {
    /**
     * Logs one or more messages and optionally an error at level TRACE.
     */
    trace(...messages: any[]): void;

    /**
     * Logs one or more messages and optionally an error at level DEBUG.
     */
    debug(...messages: any[]): void;

    /**
     * Logs one or more messages and optionally an error at level INFO.
     */
    info(...messages: any[]): void;

    /**
     * Logs one or more messages and optionally an error at level WARN.
     */
    warn(...messages: any[]): void;

    /**
     * Logs one or more messages and optionally an error at level ERROR.
     */
    error(...messages: any[]): void;

    /**
     * Logs one or more messages and optionally an error at level FATAL.
     */
    fatal(...messages: any[]): void;

    group(name: string, expanded: boolean): void;

    groupEnd(): void;

    time(name: string, level: LogLevel): void;

    timeEnd(name: string): void;

    assert(assertion: () => boolean): void;
}
