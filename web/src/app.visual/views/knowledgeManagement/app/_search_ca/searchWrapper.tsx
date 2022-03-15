import React from "react";
import {SearchView} from "./searchView";
import {
    SearchAppDispatchModel,
    SearchAppStateModel,
    SearchViewModel,
    SearchWrapperProps, SearchWrapperState, SearchViewProps, SearchViewController
} from "./searchModel";
import {connect} from "react-redux";
import {SearchPresenter} from "./searchPresenter";
import {SearchController} from "./searchController";
import {Wrapper} from "../../../../../framework.visual/ca/wrapper";
import {makeGuid} from "../../../../../framework.core/extras/utils/uniqueIdUtils";
import {UserInfo} from "../../../../../app.model";
import {userService} from "../../../../../serviceComposition";


// wrapper ties all the pieces together
// app state, presenter, view

// responsible for
// 1. setting up the presenter as a provider to the view
// 2. selecting which view to use
class _SearchWrapper extends Wrapper<SearchWrapperProps, SearchWrapperState, SearchViewModel, SearchViewController, SearchViewProps> {
    presenterSupplier = SearchPresenter;
    controllerSupplier = SearchController;

    constructor(props: SearchWrapperProps, context: any) {
        super(props, context);

        this.state = {
            counter: 1,
        }
    }


    componentDidMount() {
        super.componentDidMount();

        setInterval(() => {
            this.setState({
                ...this.state,
                counter: this.state.counter + 1
            })
        }, 1000);
    }

    getView(): React.ElementType<SearchViewProps> {
        return SearchView;
    }

    render() {
        const View = this.getView();

        return (
          <View viewModel={this.state.viewModel} viewController={this.state.viewController}/>
        )
    }
}

// responsible for selecting data out of the app store
export function createWrappedConnector(WrappedComponent: typeof _SearchWrapper) {
    // If the mapStateToProps argument supplied to connect returns a function instead of an object,
    // it will be used to create an individual mapStateToProps function for each instance of the container.
    function mapStateToProps(state: any): SearchAppStateModel {
        // grab any necessary info from redux here
        return {
            user: new UserInfo(makeGuid())
        }
    }

    function mapDispatchToProps(dispatch: any): SearchAppDispatchModel {
        return {
            updateUser(user: UserInfo) {
                userService.updateUser(user);
            }
        }
    }

    return connect(mapStateToProps, mapDispatchToProps)(WrappedComponent);
};

export const SearchWrapper = createWrappedConnector(_SearchWrapper);



