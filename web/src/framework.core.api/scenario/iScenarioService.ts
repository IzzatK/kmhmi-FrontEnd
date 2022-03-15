import {IStorage} from "../index";
import {IPlugin} from "../index";

export interface IScenarioService extends IPlugin {
    setDataAppStore(dataStore: IStorage): void;
}
