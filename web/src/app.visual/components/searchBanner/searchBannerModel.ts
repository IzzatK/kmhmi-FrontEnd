import {Nullable} from "../../../framework.core/extras/utils/typeUtils";
import {ParamType} from "../../../app.model";
import {MenuItemVM} from "../../../framework.visual/model/menuItemVM";

export type SearchBannerProps = {
    className: string;
    onToolSelected: (id: string) => void;
    onSearchTextChanged: (value: string) => void;
    onSearchParamChanged: (id: string, value: any) => void;
    onClearSearch: () => void;
    onSearch: () => void;
    searchText: string;
    tools: MenuItemVM[];
    searchParamsBasic: SearchParamItemVM[];
    searchParamsAdvanced: SearchParamItemVM[];
}

export type SearchBannerState = {
    showAdvanced: boolean;
}

export type SearchParamItemVM = {
    id: string
    title?: Nullable<string>,
    type: Nullable<ParamType>,
    value: Nullable<any>,
    options?: Nullable<any>,
    dirty: boolean,
}
