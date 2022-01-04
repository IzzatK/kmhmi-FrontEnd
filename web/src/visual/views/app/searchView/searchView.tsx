import React, {Component} from 'react';
import './searchView.css';
import {Presenter} from "../../../../framework.visual/extras/presenter";
import {createComponentWrapper} from "../../../../framework/wrappers/componentWrapper";
import {SearchBannerPresenter} from "../../../components/searchBanner/searchBannerPresenter";
import {SearchResultsPanelPresenter} from "../../../components/searchResultsPanel/searchResultsPanelPresenter";
import {SearchGraphsPanelPresenter} from "../../../components/searchGraphsPanel/searchGraphsPanelPresenter";

import {displayService} from "../../../../application/serviceComposition";

class SearchPresenter extends Presenter {
    constructor(props: any) {
        super();

        this.id ='view/searchView';

        this.view = SearchView;

        this.displayOptions = {
            containerId: 'bumed-app',
            visible: true,
            appearClass: '',
            enterClass: '',
            exitClass: '',
            timeout: 0
        };

        this.mapDispatchToProps = (dispatch: any) => {
            return {

            }
        }

        this.mapStateToProps = (state: any, props: any) => {
            return {
                toolsVisible: displayService.getContainer('search-banner-tools').currentNodeId
            }
        }
    }
}

type Props = {
    className: string;
    toolsVisible: boolean;
}

type State = {

}

class SearchView extends Component<Props, State> {
    render() {
        const { className, toolsVisible, ...rest } = this.props;

        let cn = `${className ? className : ''} d-flex flex-column h-100`;

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

export const {
    connectedPresenter: SearchViewPresenter,
    componentId: SearchViewId
} = createComponentWrapper(SearchPresenter);

