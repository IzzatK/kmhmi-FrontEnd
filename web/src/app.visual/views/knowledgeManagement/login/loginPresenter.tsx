import React from 'react';
import './login.css';

import {VisualWrapper} from "../../../../framework.visual/extras/visualWrapper";
import {createVisualConnector} from "../../../../framework.visual/connectors/visualConnector";
import {LoginDispatchProps, LoginStateProps} from "./loginModel";
import {LoginView} from "./loginView";


class Login extends VisualWrapper {
    constructor() {
        super();

        this.id ='view/login';

        this.view = LoginView;

        this.displayOptions = {
            containerId: 'view/knowledge-management',
            visible: true,
            appearClass: '',
            enterClass: '',
            exitClass: '',
            timeout: 0
        };

        this.mapDispatchToProps = (dispatch: any): LoginDispatchProps => {
            return {

            }
        }

        this.mapStateToProps = (state: any, props: any): LoginStateProps => {
            return {

            }
        }
    }
}

export const {
    connectedPresenter: LoginPresenter,
    componentId: LoginId
} = createVisualConnector(Login);

