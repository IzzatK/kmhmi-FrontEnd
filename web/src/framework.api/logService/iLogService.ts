import {LogLevel} from "./logLevel";
import {ILogger} from "./iLogger";
import {IBasePlugin} from "../IBasePlugin";
import {Nullable} from "../../framework/extras/typeUtils";

export interface ILogService extends IBasePlugin {
    setLogLevel: (logLevel: LogLevel) => void;
    getLogger: (className?: string) => Nullable<ILogger>;
}
