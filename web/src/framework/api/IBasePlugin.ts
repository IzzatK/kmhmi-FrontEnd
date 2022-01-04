import {Nullable} from "../extras/typeUtils";
import {ILogService} from "./logService/iLogService";

export interface IBasePlugin {
    start: () => void;
    stop: () => void;
    configure: () => void;
    getClassName: () => string;

    setLogService(logService: Nullable<ILogService>): void;
}
