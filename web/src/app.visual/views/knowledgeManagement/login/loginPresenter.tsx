import React from 'react';
import './login.css';

import {Presenter} from "../../../../framework.visual/extras/presenter";
import {createComponentWrapper} from "../../../../framework.visual/wrappers/componentWrapper";
import {LoginDispatchProps, LoginStateProps} from "./loginModel";
import {LoginView} from "./loginView";


class Login extends Presenter {
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
} = createComponentWrapper(Login);

