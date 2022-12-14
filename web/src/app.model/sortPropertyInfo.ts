import {RepoItem} from "../framework.core/services";
import {Nullable} from "../framework.core/extras/utils/typeUtils";

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
