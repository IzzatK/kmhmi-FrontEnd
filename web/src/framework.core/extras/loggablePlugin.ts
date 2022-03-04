import {ILogger} from "../../framework.api";
import {DefaultLogger} from "../services/logService/defaultLogger";
import {Nullable} from "./typeUtils";
import {ILoggablePlugin} from "../../framework.api";
import {LogLevel} from "../../framework.api";
import {forEach} from "../../framework.visual/extras/utils/collectionUtils";

export abstract class LoggablePlugin implements ILoggablePlugin{

    protected constructor() {
    }

    debug(...messages: any[]): void {
        this.syncToLog(logger => logger.debug(...messages));
    }

    error(...messages: any[]): void {
        this.syncToLog(logger => logger.error(...messages));
    }

    fatal(...messages: any[]): void {
        this.syncToLog(logger => logger.fatal(...messages));
    }

    info(...messages: any[]): void {
        this.syncToLog(logger => logger.info(...messages));
    }

    trace(...messages: any[]): void {
        this.syncToLog(logger => logger.trace(...messages));
    }

    warn(...messages: any[]): void {
        this.syncToLog(logger => logger.warn(...messages));
    }

    loopMessages(logFxn: (message: string) => void, ...messages: any[] ) {
        forEach(messages, (message:string) => {
            logFxn.call(this, message);
        })
    }

    syncToLog( logFunction: (logger: ILogger) => void) {
        const logger: Nullable<ILogger> = this.getLogger();

        if (logger != null) {
            logFunction.call(this, logger);
        }
        else {
            logFunction.call(this, new DefaultLogger(this.getClassName()))
        }
    }

    abstract getLogger(): Nullable<ILogger>;
    abstract getClassName(): string;

    assert(assertion: () => boolean): void {
        this.getLogger()?.assert(assertion);
    }

    group(name: string, expanded: boolean = false): void {
        this.getLogger()?.group(name, expanded);
    }

    groupEnd(): void {
        this.getLogger()?.groupEnd();
    }

    time(name: string, level: LogLevel): void {
        this.getLogger()?.time(name, level);
    }

    timeEnd(name: string): void {
        this.getLogger()?.timeEnd(name);
    }
}
