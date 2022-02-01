import React, {Component} from "react";
import {LoginProps, LoginState} from "./loginModel";
import { LoginPanelPresenter } from "../../../components/loginPanel/loginPanelPresenter";

export class LoginView extends Component<LoginProps, LoginState> {

    render() {
        const { className, ...rest } = this.props;

        let cn = `${className ? className : ''} d-flex flex h-100`;

        return (
            <div id={'login'} {...rest} className={cn}>
                <LoginPanelPresenter/>
            </div>
        );
    }
}
