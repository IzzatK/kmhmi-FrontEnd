import {RepoItem} from "../framework/services/repoService/repoItem";
import {Nullable} from "../framework/extras/typeUtils";

export class SortPropertyInfo extends RepoItem {
    title?: Nullable<string> = '';
    value: Nullable<any> = null;

    public static class: string = 'SortPropertyInfo';

    constructor(public id: string)
    {
        super(id);
        this.appendClassName(SortPropertyInfo.class);
    }
}