import {LogLevel} from "./logLevel";
import {ILogger} from "./iLogger";
import {IBasePlugin} from "../IBasePlugin";
import {Nullable} from "../../framework.core/extras/utils/typeUtils";

export interface ILogService extends IBasePlugin {
    setLogLevel: (logLevel: LogLevel) => void;
    getLogger: (className?: string) => Nullable<ILogger>;
}
