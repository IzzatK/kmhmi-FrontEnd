import {LogLevel} from "./logService/logLevel";

export interface ILoggablePlugin {
    debug(...messages: any[]): void;

    error(...messages: any[]): void;

    fatal(...messages: any[]): void;

    info(...messages: any[]): void;

    trace(...messages: any[]): void;

    warn(...messages: any[]): void;

    group(name: string, expanded: boolean): void;

    groupEnd(): void;

    time(name: string, level: LogLevel): void;

    timeEnd(name: string): void;

    assert(assertion: () => boolean): void;
}
