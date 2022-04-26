import React from 'react';
import {displayService} from "../../../../../serviceComposition";
import {VisualWrapper} from '../../../../../framework.visual/extras/visualWrapper';
import {SearchView} from "./searchView";
import {createVisualConnector} from "../../../../../framework.visual/connectors/visualConnector";

class Search extends VisualWrapper {
    constructor(props: any) {
        super();

        this.id ='app.visual/views/search';

        this.view = SearchView;

        this.displayOptions = {
            containerId: 'system-tool-panel',
            visible: false,
            appearClass: 'fadeIn',
            enterClass: 'fadeIn',
            // exitClass: '',
            // timeout: 0
        };

        this.mapDispatchToProps = (dispatch: any) => {
            return {

            }
        }

        this.mapStateToProps = (state: any, props: any) => {
            return {
                // toolsVisible: displayService.getContainer('search-banner-tools').currentNodeId
            }
        }
    }
}

export const {
    connectedPresenter: SearchPresenter,
    componentId: SearchPresenterId
} = createVisualConnector(Search);

