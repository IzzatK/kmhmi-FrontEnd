import React from 'react';
import {displayService} from "../../../../../application/serviceComposition";
import {Presenter} from '../../../../../framework.visual/extras/presenter';
import {SearchView} from "./searchView";
import {createComponentWrapper} from "../../../../../framework/wrappers/componentWrapper";

class Search extends Presenter {
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
} = createComponentWrapper(Search);

