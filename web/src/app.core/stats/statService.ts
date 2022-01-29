import {StatInfo} from "../../app";
import {createSelector, Selector} from "@reduxjs/toolkit";
import {StatType} from "../../app";
import {forEachKVP} from "../../framework.visual/extras/utils/collectionUtils";
import {IStatService} from "../../app.core.api";
import {Plugin} from "../../framework/extras/plugin";
import { IEntityProvider } from "../../app.core.api";
import {Nullable} from "../../framework/extras/typeUtils";

export class StatService extends Plugin implements IStatService {
    public static readonly class: string = 'StatService';
    private statProvider: Nullable<IEntityProvider<StatInfo>> = null;

    private readonly statSelectors: Record<string, Selector<any, Record<string,StatInfo>>>;

    constructor() {
        super();
        this.appendClassName(StatService.class);

        this.statSelectors = {};
    }

    getStats(statType: StatType): Record<string, StatInfo> {

        let selector: Nullable<Selector<any, Record<string, StatInfo>>> = null;

        if (this.statSelectors[statType] == null) {
            selector = this.makeGetAllStats(statType);
            this.statSelectors[statType] = selector;
        }
        else {
            selector = this.statSelectors[statType];
        }

        return selector(super.getRepoState());
    }

    start() {
        super.start();
    }

    stop() {
        super.stop();
    }

    configure() {
        super.configure();
    }

    setStatProvider(provider: IEntityProvider<StatInfo>): void {
        this.statProvider = provider;
    }

    fetchStats() {
        this.statProvider?.getAll()
            .then(statInfos => {
                this.removeAllByType(StatInfo.class)
                this.addOrUpdateAllRepoItems(statInfos)
            })
            .catch(error => {
                console.log(error);
            });
    }

    makeGetAllStats(statType: StatType) {
        return createSelector(
            [() => super.getAll(StatInfo.class)],
            (stats) => {
                let result: Record<string, StatInfo> = {};

                if (stats) {
                    forEachKVP(stats, (statKey: string, statValue: StatInfo) => {
                        if (statValue.type === statType) {
                            result[statKey] = statValue;
                        }
                    });
                }
                return result;
            }
        );
    }
}
