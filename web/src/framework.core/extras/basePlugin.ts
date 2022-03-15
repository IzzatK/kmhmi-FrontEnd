import {IBasePlugin} from "../../framework.core.api";
import {ILogger} from "../../framework.core.api";
import {LoggablePlugin} from "./loggablePlugin";
import {ILogService} from "../../framework.core.api";
import {bindInstanceMethods, Nullable} from "./utils/typeUtils";
import {ILoggablePlugin} from "../../framework.core.api";

export abstract class BasePlugin extends LoggablePlugin implements IBasePlugin, ILoggablePlugin {
    private className: string = ''
    public static class: string = 'Plugin';

    private logService: Nullable<ILogService> = null;
    private logger: Nullable<ILogger> = null;

    protected constructor()
    {
        super();
        this.appendClassName(`${BasePlugin.class}/`);

        bindInstanceMethods(this);
    }

    protected appendClassName(className: string) {
        this.className = `/${className}${this.className}`;
    }

    start(): void {
        if (this.logService != null) {
            this.debug(`Activating Plugin`);
        }
        else {
            throw new Error(`Log Service Not Available`);
        }
    }

    stop(): void {
    }

    configure(): void {
    }

    getLogger(): Nullable<ILogger> {
        return this.logger;
    }

    setLogService(logService: Nullable<ILogService>) {
        this.logService = logService;

        if (this.logService != null) {
            this.logger = this.logService.getLogger(this.className);
        } else {
            this.logger = null;
        }
    }

    getClassName(): string {
        return this.className;
    }
}
