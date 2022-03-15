import {ILogger} from "../../../framework.core.api";
import {Appender, getLogger, Level, Logger} from "log4javascript";
import {LogLevel} from "../../../framework.core.api";

export class DefaultLogger implements ILogger {
    private log: Logger;

    constructor(className: string) {
        this.log = getLogger(className);
    }

    debug(...messages: any[]): void {
        this.log.debug(...messages);
    }

    error(...messages: any[]): void {
        this.log.error(...messages);
    }

    fatal(...messages: any[]): void {
        this.log.fatal(...messages);
    }

    info(...messages: any[]): void {
        this.log.info(...messages);
    }

    trace(...messages: any[]): void {
        this.log.trace(...messages);
    }

    warn(...messages: any[]): void {
        this.log.warn(...messages);
    }

    addAppender(appender: Appender) {
        this.log.addAppender(appender);
    }

    assert(assertion: () => boolean): void {
        this.log.assert(assertion());
    }

    group(name: string, expanded: boolean): void {
        this.log.group(name, expanded);
    }

    groupEnd(): void {
        this.log.groupEnd();
    }

    time(name: string, level: LogLevel): void {
        this.log.time(name, this.getLog4JLevel(level));
    }

    timeEnd(name: string): void {
        this.log.timeEnd(name);
    }

    getLog4JLevel(level: LogLevel): Level {
        let log4JLevel: Level;
        switch(level) {
            case LogLevel.ALL:
                log4JLevel = Level.ALL;
                break;
            case LogLevel.TRACE:
                log4JLevel = Level.TRACE;
                break;
            case LogLevel.DEBUG:
                log4JLevel = Level.DEBUG;
                break;
            case LogLevel.INFO:
                log4JLevel = Level.INFO;
                break;
            case LogLevel.WARN:
                log4JLevel = Level.WARN;
                break;
            case LogLevel.ERROR:
                log4JLevel = Level.ERROR;
                break;
            case LogLevel.FATAL:
                log4JLevel = Level.FATAL;
                break;
            case LogLevel.OFF:
            default:
                log4JLevel = Level.OFF;
        }
        return log4JLevel;
    }



}
