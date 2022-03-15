import {Nullable} from "../framework.core/extras/utils/typeUtils";
import {ILogService} from "./logService/iLogService";

export interface IBasePlugin {
    start: () => void;
    stop: () => void;
    configure: () => void;
    getClassName: () => string;

    setLogService(logService: Nullable<ILogService>): void;
}
