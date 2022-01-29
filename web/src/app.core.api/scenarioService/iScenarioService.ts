import {IStorage} from "../../framework.api";
import {IPlugin} from "../../framework.api";

export interface IScenarioService extends IPlugin {
    setDataAppStore(dataStore: IStorage): void;
}
