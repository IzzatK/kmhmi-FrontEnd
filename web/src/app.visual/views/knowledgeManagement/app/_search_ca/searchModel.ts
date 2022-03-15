import {UserInfo} from "../../../../../app.model";
import {UserInfoVM} from "../appModel";
import {Nullable} from "../../../../../framework.core/extras/utils/typeUtils";

export type SearchAppStateModel = {
    user: UserInfo;
}

export type SearchAppDispatchModel = {
    updateUser: (user: UserInfo) => void;
}

export type SearchWrapperProps = SearchAppStateModel & SearchAppDispatchModel;
// export type SearchProps = SearchAppStateModel & SearchAppDispatchModel & ViewSupplier<SearchViewModel>;

export type SearchWrapperState = {
    viewModel?: SearchViewModel;
    viewController?: SearchViewController;

    counter: number;
}


export type SearchViewModel = {
    user: Nullable<UserInfoVM>;
    className?: string;
    toolsVisible?: boolean;
    counter: string;
};

export type SearchViewController = {
    onUserUpdated: (name: string, value: string) => void;
};

export type SearchViewProps = {
    viewModel?: SearchViewModel;
    viewController?: SearchViewController;
}
