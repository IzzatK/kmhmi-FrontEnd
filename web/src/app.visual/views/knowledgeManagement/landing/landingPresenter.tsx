import React from 'react';
import './landing.css';

import {Presenter} from "../../../../framework.visual/extras/presenter";
import {createComponentWrapper} from "../../../../framework/wrappers/componentWrapper";
import {LandingDispatchProps, LandingStateProps} from "./landingModel";
import {LandingView} from "./landingView";


class Landing extends Presenter {
    constructor() {
        super();

        this.id ='view/landing';

        this.view = LandingView;

        this.displayOptions = {
            containerId: 'view/knowledge-management',
            visible: true,
            appearClass: '',
            enterClass: '',
            exitClass: '',
            timeout: 0
        };

        this.mapDispatchToProps = (dispatch: any): LandingDispatchProps => {
            return {

            }
        }

        this.mapStateToProps = (state: any, props: any): LandingStateProps => {
            return {

            }
        }
    }
}

export const {
    connectedPresenter: LandingPresenter,
    componentId: LandingId
} = createComponentWrapper(Landing);

