import React, {Component} from 'react';
import './searchView.css';

import {SearchBannerWrapper} from "../../../../components/searchBanner/searchBannerWrapper";
import {SearchResultsPanelWrapper} from "../../../../components/searchResultsPanel/searchResultsPanelWrapper";
import {SearchGraphsPanelWrapper} from "../../../../components/searchGraphsPanel/searchGraphsPanelWrapper";

import {Props, State} from "./searchModel";

export class SearchView extends Component<Props, State> {
    render() {
        const { className, toolsVisible, permissions, ...rest } = this.props;

        let cn = `${className ? className : ''} d-flex flex-column h-100 search-view`;

        return (
            <div id={'search-view'} {...rest} className={cn}>
                {
                    permissions.canSearch ?
                        <SearchBannerWrapper />
                        :
                        <div className={"d-flex flex-fill align-items-center justify-content-center"}>
                            {
                                !permissions.isAuthorizing &&
                                <div className={'display-1 text-secondary'}>You do not have search permissions</div>
                            }
                        </div>
                }

                {
                    permissions.canSearch &&
                    <SearchResultsPanelWrapper className={'flex-fill'}/>
                }

                <SearchGraphsPanelWrapper/>
            </div>
        );
    }
}

