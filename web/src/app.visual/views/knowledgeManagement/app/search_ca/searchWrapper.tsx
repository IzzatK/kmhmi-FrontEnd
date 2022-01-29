import React, {Component, ElementType} from "react";
import {SearchView} from "./searchView";
import {
    SearchAppDispatchModel,
    SearchAppModel,
    SearchAppStateModel,
    SearchViewModel
} from "./searchModel";
import {connect} from "react-redux";
import {createDisplayConnector} from "../../../../../framework/wrappers/displayWrapper";
import {SearchPresenter} from "./searchPresenter";
import {SearchViewSmall} from "./searchViewSmall";



// wrapper ties all the pieces together
// app state, presenter, view


// responsible for
// 1. setting up the presenter as a provider to the view
// 2. selecting which view to use
class _SearchWrapper extends Component<SearchAppModel> {

    componentDidMount() {
        // initiate any remote data source fetching
    }

    componentWillUnmount() {
        // stop any remote data source fetching
    }

    getView(): ElementType<SearchViewModel> {
        let result: ElementType<SearchViewModel>;

        if (Math.random() < 0.5) {
            result = SearchView;
        }
        else {
            result = SearchViewSmall;
        }

        return SearchView;
    }

    render() {
        return (
          <SearchPresenter viewSupplier={this.getView}/>
        )
    }
}

// responsible for selecting data out of the app store
export function createWrappedConnector(WrappedComponent: React.ElementType<SearchAppModel>) {
    // If the mapStateToProps argument supplied to connect returns a function instead of an object,
    // it will be used to create an individual mapStateToProps function for each instance of the container.
    function mapStateToProps(state: any): SearchAppStateModel {
        // grab any necessary info from redux here
        return {

        }
    };

    function mapDispatchToProps(dispatch: any): SearchAppDispatchModel {
        return {

        }
    }

    return connect(mapStateToProps, mapDispatchToProps)(WrappedComponent);
};

export const SearchWrapper = createDisplayConnector(createWrappedConnector(_SearchWrapper), 'search');



