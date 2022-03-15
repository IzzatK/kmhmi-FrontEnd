import {StatType} from "../../app.model";
import {StatInfo} from "../../app.model";
import {IPlugin} from "../../framework.core.api";
import {IEntityProvider} from "../../framework.core.api/iEntityProvider";

export interface IStatService extends IPlugin {
    fetchStats(): void;

    getStats(statType: StatType): Record<string, StatInfo>;

    setStatProvider(provider: IEntityProvider<StatInfo>): void;
}
