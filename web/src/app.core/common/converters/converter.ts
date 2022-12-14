import {IConverter} from "../../../framework.core.api";
import {LoggablePlugin} from "../../../framework.core/extras/loggablePlugin";
import {ILoggablePlugin, ILogger, IRepositoryService} from "../../../framework.core.api";
import {bindInstanceMethods, Nullable} from "../../../framework.core/extras/utils/typeUtils";
import {IRepoItem} from "../../../framework.core/services";

export abstract class Converter<FromType, ToType> extends LoggablePlugin implements IConverter<FromType, ToType>, ILoggablePlugin {
    protected className: string;
    protected logger: Nullable<ILogger>;
    private repoService: Nullable<IRepositoryService> = null;

    constructor(className: string, logger: Nullable<ILogger>) {
        super();
        bindInstanceMethods(this);

        this.logger = logger;
        this.className = className;
    }

    abstract convert(fromData: FromType, reject?: any, options?: any): ToType;


    getLogger(): Nullable<ILogger> {
        return this.logger;
    }

    getClassName(): string {
        return this.className;
    }

    setRepositoryService(repoService: Nullable<IRepositoryService>): void {
        this.repoService = repoService;
    }

    protected getRepoItem<T extends IRepoItem>(className: string, id: string): Nullable<T> {
        let result: Nullable<T> = null;

        if (this.repoService != null) {
            result = this.repoService.getSingle<T>(className, id);
        }
        return result;
    }

    protected getRepoItems<T extends IRepoItem>(className: string, includeSubTypes: boolean = false, ...ids: string[]): Record<string, T> {
        let result: Record<string, T> = {};

        if (this.repoService != null) {
            result = this.repoService.getAll<T>(className, includeSubTypes, ...ids);
        }

        return result;
    }
}
