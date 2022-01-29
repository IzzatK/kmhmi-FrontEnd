import {ElementType} from "react";

export type SearchAppStateModel = {

}

export type SearchAppDispatchModel = {

}

export type SearchAppView = {
    viewSupplier: () => ElementType<SearchViewModel>;
}

export type SearchAppModel = SearchAppStateModel & SearchAppDispatchModel & SearchAppView;

export type SearchViewModel = {
    className: string;
    toolsVisible: boolean;
}
