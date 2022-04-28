import {Nullable} from "../../../framework.core/extras/utils/typeUtils";
import {ParamType} from "../../../app.model";
import {MenuItemVM} from "../../../framework.visual";

export type SearchBannerAppStateProps = {
    className?: string;
    searchText: string;
    tools: MenuItemVM[];
    searchParamsBasic: SearchParamItemVM[];
    searchParamsAdvanced: SearchParamItemVM[];
}

export type SearchBannerAppDispatchProps = {
    onToolSelected: (id: string) => void;
    onSearchTextChanged: (value: string) => void;
    onSearchParamChanged: (id: string, value: any) => void;
    onClearSearch: () => void;
    onSearch: () => void;
}

export type SearchBannerPresenterProps = SearchBannerAppStateProps & SearchBannerAppDispatchProps;

export type SearchBannerPresenterState = {
    showAdvanced: boolean;
}

export type SearchBannerViewProps = {
    className?: string;
    searchText: string;
    tools: MenuItemVM[];
    searchParamsBasic: SearchParamItemVM[];
    searchParamsAdvanced: SearchParamItemVM[];
    showAdvanced: boolean;
    onToolSelected: (id: string) => void;
    onSearchTextChanged: (value: string) => void;
    onSearchParamChanged: (id: string, value: any) => void;
    onClearSearch: () => void;
    onSearch: () => void;
    onDateChanged: (state: string, id: string, propertyId: string, propertyValue: string) => void;
    onSetShowAdvanced: (value: boolean) => void;
}

export type SearchParamItemVM = {
    id: string
    title?: Nullable<string>,
    type: Nullable<ParamType>,
    value: Nullable<any>,
    options?: Nullable<any>,
    dirty: boolean,
}
