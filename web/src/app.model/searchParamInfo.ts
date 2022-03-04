import {RepoItem} from "../framework.core/services/repoService/repoItem";
import {ParamType} from "./paramType";
import {Nullable} from "../framework.core/extras/typeUtils";

export class SearchParamInfo extends RepoItem {
    title?: Nullable<string> = '';
    type: Nullable<ParamType> = null;
    value: Nullable<any> = null;
    options?: Nullable<any> = null;
    optionsId?: Nullable<string> = null;
    visible: boolean = false;
    advanced: boolean = true;
    dirty: boolean = false;

    public static class: string = 'SearchParamInfo';

    constructor(public id: string)
    {
        super(id);
        this.appendClassName(SearchParamInfo.class);
    }
}

