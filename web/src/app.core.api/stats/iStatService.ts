import {StatType} from "../../app.model";
import {StatInfo} from "../../app.model";
import {IRepoItem} from "../../framework/services/repoService/repoItem";
import {IPlugin} from "../../framework.api";
import {IEntityProvider} from "../common/iEntityProvider";

export interface IStatService extends IPlugin {
    fetchStats(): void;

    getStats(statType: StatType): Record<string, StatInfo>;

    setStatProvider(provider: IEntityProvider<StatInfo>): void;
}
