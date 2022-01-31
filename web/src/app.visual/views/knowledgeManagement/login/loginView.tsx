import React, {Component} from "react";
import {LoginProps, LoginState} from "./loginModel";
import {Size} from "../../../theme/widgets/loadingIndicator/loadingIndicatorModel";
import {LoadingIndicator} from "../../../theme/widgets/loadingIndicator/loadingIndicator";
import { LoginPanelPresenter } from "../../../components/loginPanel/loginPanelPresenter";

export class LoginView extends Component<LoginProps, LoginState> {

    timeout!: NodeJS.Timeout;

    constructor(props: Readonly<LoginProps> | LoginProps) {
        super(props);

        this.state = {
            loading: true
        }
    }

    componentDidMount() {
        this.timeout = setTimeout(() => {
            this.setLoading(false);
        }, 1500);
    }


    componentWillUnmount() {
        clearTimeout(this.timeout);
    }

    setLoading(value: boolean) {
        this.setState({
            ...this.state,
            loading: value
        })
    }

    render() {
        const { className, ...rest } = this.props;

        const { loading } = this.state;

        let cn = `${className ? className : ''} d-flex flex h-100`;

        return (
            <div id={'login'} {...rest} className={cn}>
                {
                    loading ?
                        <LoadingIndicator size={Size.large}/> :
                        <LoginPanelPresenter/>
                }
            </div>
        );
    }
}
