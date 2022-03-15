import {BasePlugin} from "../../extras/basePlugin";
import {ILogService} from "../../../framework.api";
import {ILogger} from "../../../framework.api";
import {DefaultLogger} from "./defaultLogger";
import {LogLevel} from "../../../framework.api";
import {getRootLogger, Level, PatternLayout, PopUpAppender} from "log4javascript";
import {Nullable} from "../../extras/utils/typeUtils";

export class LogService extends BasePlugin implements ILogService {

    private readonly loggers: Record<string, ILogger>;
    private readonly globalLogger: string = 'globalLogger';

    // Create a PopUpAppender with default options
    private popUpAppender: PopUpAppender = new PopUpAppender();

    public static class: string = 'LogService';

    constructor() {
        super();
        this.appendClassName(LogService.class);

        this.loggers = {};
        this.loggers[this.globalLogger] = new DefaultLogger(this.globalLogger);

        // Change the desired configuration options
        this.popUpAppender.setFocusPopUp(true);
        this.popUpAppender.setShowCommandLine(false);
        // this.popUpAppender.setLayout(new JsonLayout(true, false));
        this.popUpAppender.setLayout(new PatternLayout(
            '{ %n  timestamp: [%d{dd MMM yyyy HH:mm:ss,SSS}] %n  level: [%p] %n  logger: [%c] %n  message: %m %n}'
            // `%d{HH:mm:ss} %-5p - %c - %m{1}%n%n`
        ));


        const ref: Nullable<ILogService> = <ILogService>this;
        this.setLogService(ref);
    }

    getLogger(className?: string): Nullable<ILogger> {
        let result;

        if (className) {
            let shortName = className.split('/')[1];

            if (this.loggers[shortName]) {
                result = this.loggers[shortName];
            }
            else {
                result = new DefaultLogger(shortName);
                // Add the appender to the logger
                // result.addAppender(this.popUpAppender);
                this.loggers[shortName] = result;
            }
        }
        else {
            result = this.loggers[this.globalLogger];
        }


        return result;
    }


    configure() {
        super.configure();
        this.setLogLevel(LogLevel.ALL);
    }

    setLogLevel(level: LogLevel): void {
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

        getRootLogger().setLevel(log4JLevel);
    }
}

