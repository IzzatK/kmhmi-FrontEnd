import React, {Component} from "react";
import './landingPanel.css';
import {LoginPanelProps, LoginPanelState, UserInfoVM} from "./landingPanelModel";
import {bindInstanceMethods, nameOf} from "../../../framework/extras/typeUtils";
import Button from "../../theme/widgets/button/button";
import TextEdit from "../../theme/widgets/textEdit/textEdit";
import {RegistrationStatusType} from "../../model/registrationStatusType";

class LandingPanelView extends Component<LoginPanelProps, LoginPanelState> {
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
        const { className, registrationStatus } = this.props;

        const { tmpUser } = this.state;

        let cn = 'landing-panel d-flex flex-fill justify-content-center align-items-center';
        if (className) {
            cn += ` ${className}`;
        }
        // if (!isError && !isUnregistered && !isLogout) {
        //     cn += " bg-transparent"
        // }

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


                        {
                            (registrationStatus === RegistrationStatusType.NONE) &&
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

                        }

                        {
                            (registrationStatus === RegistrationStatusType.SUBMITTED) &&
                            <div className={"popup v-gap-5 w-33"}>
                                <div className={"text-selected font-weight-semi-bold px-5 pt-5"}>
                                    <div className={"d-flex justify-content-center mt-5 pt-5"}>Your Authorization is Pending...</div>
                                </div>

                                <div className={"d-flex flex-column justify-content-center align-items-center v-gap-5 px-5 mx-5"}>
                                    {
                                        <div className={"d-flex flex-column justify-content-center align-items-center v-gap-5"}>
                                            <div className={"text-info font-weight-light display-3 pt-5"}>An admin needs to authorize you in order to access CIC Knowledge Management</div>
                                            {/*<div className={"d-flex admin header-2 h-gap-5 pt-5"}>*/}
                                            {/*    <div>{admin.name}</div>*/}
                                            {/*    <div className={"d-flex h-gap-2"}>*/}
                                            {/*        <div>PHONE</div>*/}
                                            {/*        <div>{admin.phone}</div>*/}
                                            {/*    </div>*/}
                                            {/*    <div className={"d-flex h-gap-2"}>*/}
                                            {/*        <div>EMAIL</div>*/}
                                            {/*        <div>{admin.email}</div>*/}
                                            {/*    </div>*/}
                                            {/*</div>*/}
                                        </div>
                                    }
                                    <div className={"text-info font-weight-light display-3 pt-5"}>Please check back once your authorization has been approved.</div>
                                </div>

                                <div className={"d-flex justify-content-end py-4 pr-5 bg-advisory mx-5"}/>
                            </div>
                        }

                        {
                            (registrationStatus === RegistrationStatusType.APPROVED) &&
                            <div className={"d-flex justify-content-center align-items-center"}>
                                <div className={"d-flex flex-column popup v-gap-5"}>
                                    <div className={"text-selected font-weight-semi-bold px-5 pt-5"}>
                                        <div className={"d-flex justify-content-center mt-5 pt-5"}>Authorization Complete</div>
                                    </div>

                                    <div className={"d-flex flex-column justify-content-center align-items-center v-gap-5 px-5 mx-5"}>
                                        <div className={"text-info font-weight-light display-3 pt-5"}>You may now sign in.</div>
                                    </div>

                                    <div className={"d-flex justify-content-end py-4 pr-5 bg-advisory"}/>
                                </div>
                            </div>
                        }

                        {/*{*/}
                        {/*    (isAuthPending || isLogin || isAuthRequest || isRegister) &&*/}
                        {/*    <div className={"d-flex flex-column popup v-gap-5"}>*/}
                        {/*        <div className={"text-selected font-weight-semi-bold px-5 pt-5"}>*/}
                        {/*            {*/}
                        {/*                isAuthRequest &&*/}
                        {/*                <div>Authorization Request</div>*/}
                        {/*            }*/}
                        {/*            {*/}
                        {/*                isLogin &&*/}
                        {/*                <div>Sign In</div>*/}
                        {/*            }*/}
                        {/*            {*/}
                        {/*                isRegister &&*/}
                        {/*                <div>Register</div>*/}
                        {/*            }*/}
                        {/*            {*/}
                        {/*                isAuthPending &&*/}
                        {/*                <div className={"d-flex justify-content-center mt-5 pt-5"}>Your Authorization is Pending...</div>*/}
                        {/*            }*/}
                        {/*        </div>*/}

                        {/*        {*/}
                        {/*            isAuthRequest &&*/}
                        {/*            <div className={"v-gap-5"}>*/}
                        {/*                <div className={"d-flex h-gap-5 justify-content-start px-5"}>*/}
                        {/*                    <div className={"d-flex h-gap-2"}>*/}
                        {/*                        <div className={"align-self-center display-3 font-weight-semi-bold"}>Full Name:</div>*/}
                        {/*                        <div className={"align-self-center text-info font-weight-light display-4"}>{user?.name}</div>*/}
                        {/*                    </div>*/}
                        {/*                    <div className={"d-flex h-gap-2"}>*/}
                        {/*                        <div className={"align-self-center display-3 font-weight-semi-bold"}>DoD ID:</div>*/}
                        {/*                        <div className={"align-self-center text-info font-weight-light display-4"}>{user?.dodId}</div>*/}
                        {/*                    </div>*/}
                        {/*                    <div className={"d-flex h-gap-2 pl-1"}>*/}
                        {/*                        <div className={"align-self-center display-3 font-weight-semi-bold"}>Role:</div>*/}
                        {/*                        <ComboBox onSelect={(value: string) => this.onTmpUserChanged("role", value)} title={roleTitle} items={roles}/>*/}
                        {/*                    </div>*/}
                        {/*                </div>*/}
                        {/*                <div className={"px-5"}>*/}
                        {/*                    <TextArea value={tmpUser["request"] ? tmpUser["request"] : user?.request} autoFocus={true} name={"request"}*/}
                        {/*                              placeholder={"Please provide organizational affiliation and reason for accessing the CIC Knowledge Management System"}*/}
                        {/*                              rows={9} cols={85} onSubmit={this.onTmpUserChanged}/>*/}
                        {/*                </div>*/}
                        {/*            </div>*/}
                        {/*        }*/}

                        {/*        {*/}
                        {/*            isLogin &&*/}
                        {/*            <div className={"v-gap-5"}>*/}
                        {/*                <div className={'login-grid px-5'}>*/}
                        {/*                    <div className={"align-self-center display-3 font-weight-semi-bold justify-self-end"}>DoD ID:</div>*/}
                        {/*                    <div className={"align-self-center display-3 font-weight-semi-bold justify-self-end"}>User Name:</div>*/}
                        {/*                    <div className={"align-self-center display-3 font-weight-semi-bold justify-self-end"}>Email:</div>*/}
                        {/*                    <div className={"align-self-center display-3 font-weight-semi-bold justify-self-end"}>CAC PIN:</div>*/}
                        {/*                    <div className={"align-self-center text-info font-weight-light display-4"}>{user?.dodId}</div>*/}
                        {/*                    <div className={"align-self-center text-info font-weight-light display-4"}>{user?.name}</div>*/}
                        {/*                    <div className={"align-self-center text-info font-weight-light display-4"}>{user?.email}</div>*/}
                        {/*                    <TextEdit value={tmpUser["pin"] ? tmpUser["pin"] : user?.pin} name={"pin"} autoFocus={true} placeholder={"CAC PIN"} onSubmit={this.onTmpUserChanged}/>*/}
                        {/*                </div>*/}
                        {/*                <div className={"d-flex h-gap-2 justify-content-end px-5"}>*/}
                        {/*                    <CheckBox selected={isRemember} onClick={() => this._toggleRemember()}/>*/}
                        {/*                    <div className={"align-self-center text-info header-3"}>Remember Me</div>*/}
                        {/*                </div>*/}
                        {/*            </div>*/}
                        {/*        }*/}

                        {/*        {*/}
                        {/*            isRegister &&*/}
                        {/*            <div className={"v-gap-5"}>*/}
                        {/*                <div className={'register-grid px-5'}>*/}
                        {/*                    <div className={"align-self-center text-info display-3 font-weight-semi-bold justify-self-end"}>DoD ID:</div>*/}
                        {/*                    <div className={"align-self-center text-info display-3 font-weight-semi-bold justify-self-end"}>User Name:</div>*/}
                        {/*                    <div className={"align-self-center display-3 font-weight-semi-bold justify-self-end"}>Email:</div>*/}
                        {/*                    <div className={"align-self-center display-3 font-weight-semi-bold justify-self-end"}>Phone:</div>*/}
                        {/*                    <div className={"align-self-center display-3 font-weight-semi-bold justify-self-end"}>Organization:</div>*/}
                        {/*                    <div className={"align-self-center display-3 font-weight-semi-bold justify-self-end"}>PIN:</div>*/}
                        {/*                    <div className={"align-self-center text-info font-weight-light display-4"}>{user?.dodId}</div>*/}
                        {/*                    <div className={"align-self-center text-info font-weight-light display-4"}>{user?.name}</div>*/}
                        {/*                    <TextEdit value={tmpUser["email"] ? tmpUser["email"] : user?.email} name={"email"} autoFocus={true} placeholder={"Email Address"} onSubmit={this.onTmpUserChanged}/>*/}
                        {/*                    <TextEdit value={tmpUser["phone"] ? tmpUser["phone"] : user?.phone} name={"phone"} placeholder={"Phone Number"} onSubmit={this.onTmpUserChanged}/>*/}
                        {/*                    <TextEdit value={tmpUser["organization"] ? tmpUser["organization"] : user?.organization} name={"organization"} placeholder={"Organization"} onSubmit={this.onTmpUserChanged}/>*/}
                        {/*                    <TextEdit value={tmpUser["pin"] ? tmpUser["pin"] : user?.pin} name={"pin"} placeholder={"CAC PIN"} onSubmit={this.onTmpUserChanged}/>*/}
                        {/*                </div>*/}
                        {/*                <div className={"d-flex h-gap-2 justify-content-end px-5"}>*/}
                        {/*                    <CheckBox selected={isRemember} onClick={() => this._toggleRemember()}/>*/}
                        {/*                    <div className={"align-self-center text-info header-3"}>Remember Me</div>*/}
                        {/*                </div>*/}
                        {/*            </div>*/}
                        {/*        }*/}

                        {/*        {*/}
                        {/*            isAuthPending &&*/}
                        {/*            <div className={"d-flex flex-column justify-content-center align-items-center v-gap-5 px-5 mx-5"}>*/}
                        {/*                <div className={"text-info font-weight-light display-3 pt-5"}>The following admin needs to authorize you in order to access CIC Knowledge Management</div>*/}
                        {/*                <div className={"d-flex admin header-2 h-gap-5 pt-5"}>*/}
                        {/*                    <div>{admin && admin.name}</div>*/}
                        {/*                    <div className={"d-flex h-gap-2"}>*/}
                        {/*                        <div>PHONE</div>*/}
                        {/*                        <div>{admin && admin.phone}</div>*/}
                        {/*                    </div>*/}
                        {/*                    <div className={"d-flex h-gap-2"}>*/}
                        {/*                        <div>EMAIL</div>*/}
                        {/*                        <div>{admin && admin.email}</div>*/}
                        {/*                    </div>*/}
                        {/*                </div>*/}
                        {/*                <div className={"text-info font-weight-light display-3 pt-5"}>Please check back once your authorization has been approved.</div>*/}
                        {/*            </div>*/}
                        {/*        }*/}

                        {/*        <div className={"d-flex justify-content-end py-4 pr-5 bg-advisory"}>*/}
                        {/*            {*/}
                        {/*                !isAuthPending &&*/}
                        {/*                <Button text={"Submit"} light={true} onClick={() => this._onSubmit()}/>*/}
                        {/*            }*/}
                        {/*        </div>*/}
                        {/*    </div>*/}
                        {/*}*/}

                        {/*<div className={"d-flex flex-column justify-content-center align-items-center text-wrap v-gap-5"}>*/}
                        {/*    <div className={"text-advisory"}>*/}
                        {/*        {*/}
                        {/*            isError &&*/}
                        {/*            <div>There is no valid Common Access Card (CAC) found.</div>*/}
                        {/*        }*/}
                        {/*        {*/}
                        {/*            isUnregistered &&*/}
                        {/*            <div>You are not recognized as an authorized user.</div>*/}
                        {/*        }*/}
                        {/*        {*/}
                        {/*            isLogout &&*/}
                        {/*            <div>*Please Exit your Browser*</div>*/}
                        {/*        }*/}
                        {/*    </div>*/}
                        {/*    <div className={"display-1 text-accent"}>*/}
                        {/*        {*/}
                        {/*            isError &&*/}
                        {/*            <div>Please verify that your card is properly inserted in the reader and close and reopen your browser.</div>*/}
                        {/*        }*/}
                        {/*        {*/}
                        {/*            isUnregistered &&*/}
                        {/*            <div className={"text-center"}>If you are already authorized, please verify that your card is properly inserted in the reader and Reload.*/}
                        {/*                <br/> If you have received this message in error or need to be authorized, click Get Info.</div>*/}
                        {/*        }*/}
                        {/*        {*/}
                        {/*            isLogout &&*/}
                        {/*            <div className={"text-center"}>You have successfully logged out of the CIC Knowledge Management Product*/}
                        {/*                <br/>Please close your current browser to ensure secure logout</div>*/}
                        {/*        }*/}
                        {/*    </div>*/}
                        {/*    <div className={"d-flex h-gap-5"}>*/}
                        {/*        {*/}
                        {/*            isUnregistered &&*/}
                        {/*            <Button text={"Get Info"} onClick={() => this._onGetInfo()}/>*/}
                        {/*        }*/}
                        {/*        {*/}
                        {/*            !isLogout &&*/}
                        {/*            <Button text={"Reload"} onClick={() => this._onReload()}/>*/}
                        {/*        }*/}
                        {/*        {*/}
                        {/*            isLogout &&*/}
                        {/*            <Button text={"Close Browser"} onClick={() => this._onClose()}/>*/}
                        {/*        }*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                    </div>
                </div>
            </div>
        )
    }
}

export default LandingPanelView;
