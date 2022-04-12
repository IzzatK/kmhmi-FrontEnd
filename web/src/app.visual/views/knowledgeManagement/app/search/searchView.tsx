import React, {Component} from 'react';
import './searchView.css';

import {SearchBannerPresenter} from "../../../../components/searchBanner/searchBannerPresenter";
import {SearchResultsPanelPresenter} from "../../../../components/searchResultsPanel/searchResultsPanelPresenter";
import {SearchGraphsPanelPresenter} from "../../../../components/searchGraphsPanel/searchGraphsPanelPresenter";

import {Props, State} from "./searchModel";

export class SearchView extends Component<Props, State> {
    render() {
        const { className, toolsVisible, ...rest } = this.props;

        let cn = `${className ? className : ''} d-flex flex-column h-100 search-view`;

        return (
            <div id={'search-view'} {...rest} className={cn}>
                {/*<ServiceContext.Consumer>*/}
                {/*    {*/}
                {/*        application => {*/}
                {/*           return <SearchBannerPresenter application={application}/>*/}
                {/*        }*/}
                {/*    }*/}
                {/*</ServiceContext.Consumer>*/}
                <SearchBannerPresenter />

                <div className={`search-view-tools position-relative ${toolsVisible ? 'expanded': 'collapsed'}`}>
                    {/*<SearchAdvancedPanelPresenter className={'position-absolute w-100 h-100'}/>*/}
                    <SearchGraphsPanelPresenter/>
                </div>

                <SearchResultsPanelPresenter className={'flex-fill'}/>
            </div>
        );
    }
}

