import React, {Component} from "react";
import {LoginProps, LoginState} from "./loginModel";
import {LoginPanelPresenter} from "../../../components/loginPanel/loginPanelPresenter";
import {referenceService} from "../../../../serviceComposition";
import {ReferenceType} from "../../../../app.model";

export class LoginView extends Component<LoginProps, LoginState> {
    private interval!: NodeJS.Timer;

    componentDidMount() {
        this.interval = setInterval(() => {
            this.fetchData();
        }, 300000); // 5 minutes
        this.fetchData();
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    fetchData() {
        referenceService.fetchReferences(ReferenceType.DEPARTMENT);
    }

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
