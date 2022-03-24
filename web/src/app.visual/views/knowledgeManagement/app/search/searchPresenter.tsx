import React from 'react';
import {displayService} from "../../../../../serviceComposition";
import {VisualWrapper} from '../../../../../framework.visual/extras/visualWrapper';
import {SearchView} from "./searchView";
import {createVisualConnector} from "../../../../../framework.visual/connectors/visualConnector";

class Search extends VisualWrapper {
    constructor(props: any) {
        super();

        this.id ='view/search';

        this.view = SearchView;

        this.displayOptions = {
            containerId: 'view/app',
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

export const {
    connectedPresenter: SearchPresenter,
    componentId: SearchPresenterId
} = createVisualConnector(Search);

