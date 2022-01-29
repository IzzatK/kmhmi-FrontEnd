import React from 'react';
import './searchView.css';

import {SearchResultsPanelPresenter} from "../../../../components/searchResultsPanel/searchResultsPanelPresenter";
import {SearchGraphsPanelPresenter} from "../../../../components/searchGraphsPanel/searchGraphsPanelPresenter";
import {SearchViewModel} from "./searchModel";

export class SearchView extends React.Component<SearchViewModel> {
    render() {
        const {className, toolsVisible, ...rest} = this.props;

        let cn = `${className ? className : ''} d-flex flex-column h-100`;

        return (
            <div id={'search-view'} {...rest} className={cn}>
                <div className={`search-view-tools position-relative ${toolsVisible ? 'expanded' : 'collapsed'}`}>
                    {/*<SearchAdvancedPanelPresenter className={'position-absolute w-100 h-100'}/>*/}
                    <SearchGraphsPanelPresenter/>
                </div>

                <SearchResultsPanelPresenter className={'flex-fill'}/>
            </div>
        );
    }
}

