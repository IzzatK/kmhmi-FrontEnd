import React from 'react';
import {VisualWrapper} from '../../../../../framework.visual';
import {SearchView} from "./searchView";
import {createVisualConnector} from "../../../../../framework.visual";

class Search extends VisualWrapper {
    constructor(props: any) {
        super();

        this.id ='app.visual/views/search';

        this.view = SearchView;

        this.displayOptions = {
            containerId: 'system-tool-panel',
            visible: true,
            appearClass: 'fadeIn',
            enterClass: 'fadeIn',
        };

        this.mapDispatchToProps = (dispatch: any) => {
            return {

            }
        }

        this.mapStateToProps = (state: any, props: any) => {
            return {

            }
        }
    }
}

export const {
    connectedPresenter: SearchPresenter,
    componentId: SearchPresenterId
} = createVisualConnector(Search);

