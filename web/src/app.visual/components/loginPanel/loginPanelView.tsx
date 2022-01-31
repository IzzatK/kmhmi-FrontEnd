import React, {Component} from "react";
import './loginPanel.css';
import {LoginPanelProps, LoginPanelState, UserInfoVM} from "./loginPanelModel";
import {bindInstanceMethods, nameOf} from "../../../framework/extras/typeUtils";
import Button from "../../theme/widgets/button/button";
import TextEdit from "../../theme/widgets/textEdit/textEdit";
import {RegistrationStatusType} from "../../model/registrationStatusType";

class LoginPanelView extends Component<LoginPanelProps, LoginPanelState> {
    constructor(props: any, context: any) {
        super(props, context);

        bindInstanceMethods(this);

        this.state = {
            tmpUser: {
                dod_id: '',
                first_name: '',
                last_name: '',
                email: '',
                phone: ''
            },
        }
    }

    componentDidMount() {

    }

    componentDidUpdate(prevProps: Readonly<LoginPanelProps>, prevState: Readonly<LoginPanelState>, snapshot?: any) {

    }

    _onLogin() {
        const {onLogin} = this.props;

        if (onLogin != null) {
            onLogin();
        }
    }

    _onRegister() {
        const { onRegister } = this.props;
        const { tmpUser } = this.state;

        // need to validate the entries here TODO Josiah

        if (onRegister != null) {
            onRegister(tmpUser);
        }
    }

    onTmpUserChanged(name: string, value: string) {
        const { tmpUser } = this.state;

        let nextUser = {
            ...tmpUser,
            [name]: value
        };

        this.setTmpUser(nextUser);
    }

    setTmpUser(user: UserInfoVM) {
        this.setState({
            ...this.state,
            tmpUser: user
        });
    }

    render() {
        const { className } = this.props;

        const { tmpUser } = this.state;

        let cn = 'login-panel d-flex flex-fill justify-content-center align-items-center';
        if (className) {
            cn += ` ${className}`;
        }

        return (
            <div className={cn}>
                <div className={"d-flex flex-fill position-relative h-100"}>
                    <div className={"position-absolute"}/>
                    <div className={'d-flex flex-fill justify-content-between'} style={{zIndex: 999}}>
                        <div className={"d-flex flex-fill align-items-center justify-content-center"}>
                            <div className={"d-flex flex-column"}>
                                <div className={"d-flex flex-column light-popup v-gap-5"}>
                                    <div className={"d-flex text-selected font-weight-semi-bold px-5 pt-5"}>
                                        <div>Returning User</div>
                                    </div>
                                    <div className={"light-info px-5 text-wrap display-3"}>
                                        If you have already created a profile, click "submit" to access the CIC Knowledge Management Dashboard
                                    </div>
                                </div>

                                <div className={"d-flex justify-content-end py-4 pr-5 bg-advisory"}>
                                    <Button text={"I Already Have Access"} light={true} onClick={() => this._onLogin()}/>
                                </div>
                            </div>
                        </div>

                        <div className={"d-flex flex-column dark w-50 align-items-center justify-content-center"}>
                            <div className={"d-flex flex-column"}>
                                <div className={"d-flex flex-column popup v-gap-5"}>
                                    <div className={"text-selected font-weight-semi-bold px-5 pt-5"}>
                                        <div>New user</div>
                                    </div>
                                    <div className={"info px-5 display-3"}>New to the Dashboard? Submit your information below to request authorization</div>
                                    <div className={"v-gap-5"}>
                                        <div className={'register-grid px-5'}>
                                            <div className={"align-self-center display-3 font-weight-semi-bold justify-self-end"}>DoD ID:</div>
                                            <div className={"align-self-center display-3 font-weight-semi-bold justify-self-end"}>First Name:</div>
                                            <div className={"align-self-center display-3 font-weight-semi-bold justify-self-end"}>Last Name:</div>
                                            <div className={"align-self-center display-3 font-weight-semi-bold justify-self-end"}>Email:</div>
                                            <div className={"align-self-center display-3 font-weight-semi-bold justify-self-end"}>Phone:</div>
                                            <TextEdit value={tmpUser.dod_id} name={nameOf<UserInfoVM>("dod_id")} autoFocus={true} placeholder={"DoD ID"} onSubmit={this.onTmpUserChanged}/>
                                            {/*<div className={"align-self-center text-info font-weight-light display-4"}>{user?.name}</div>*/}
                                            <TextEdit value={tmpUser.first_name} name={nameOf<UserInfoVM>("first_name")} autoFocus={true} placeholder={"First Name"} onSubmit={this.onTmpUserChanged}/>
                                            <TextEdit value={tmpUser.last_name} name={nameOf<UserInfoVM>("last_name")} autoFocus={true} placeholder={"Last Name"} onSubmit={this.onTmpUserChanged}/>
                                            <TextEdit value={tmpUser.email} name={nameOf<UserInfoVM>("email")} autoFocus={true} placeholder={"Email Address"} onSubmit={this.onTmpUserChanged}/>
                                            <TextEdit value={tmpUser.phone} name={nameOf<UserInfoVM>("phone")} placeholder={"Phone Number"} onSubmit={this.onTmpUserChanged}/>
                                        </div>
                                    </div>
                                </div>

                                <div className={"d-flex justify-content-end py-4 pr-5 bg-advisory"}>
                                    <Button text={"Submit"} light={true} onClick={() => this._onRegister()}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default LoginPanelView;
