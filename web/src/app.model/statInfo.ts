import {RepoItem} from "../framework/services/repoService/repoItem";
import {StatType} from "./statType";

export class StatInfo extends RepoItem {
    public static class: string = 'StatInfo';

    type: StatType = -1;
    item: string = '';
    count: number = 0;

    constructor(id: string)
    {
        super(id);
        this.appendClassName(StatInfo.class);

    }
}
