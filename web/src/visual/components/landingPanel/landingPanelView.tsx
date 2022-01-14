import React, {Component} from "react";
import './landingPanel.css';
import {LoginPanelProps, LoginPanelState, UserInfoVM} from "./landingPanelModel";
import {bindInstanceMethods} from "../../../framework/extras/typeUtils";
import Button from "../../theme/widgets/button/button";
import ComboBox from "../../theme/widgets/comboBox/comboBox";
import TextEdit from "../../theme/widgets/textEdit/textEdit";
import CheckBox from "../../theme/widgets/checkBox/checkBox";
import TextArea from "../../theme/widgets/textEdit/textArea";

class LandingPanelView extends Component<LoginPanelProps, LoginPanelState> {
    constructor(props: any, context: any) {
        super(props, context);

        bindInstanceMethods(this);

        this.state = {
            isRemember: false,
            tmpUser: {},
        }
    }

    componentDidMount() {
        const { user } = this.props;

        this.setTmpUser(user || {});
    }

    componentDidUpdate(prevProps: Readonly<LoginPanelProps>, prevState: Readonly<LoginPanelState>, snapshot?: any) {
        const { user } = this.props;

        if (user !== prevProps.user) {
            const {id} = user || {};
            const {id: prevId } = prevProps.user || {};

            if (id !== prevId) {
                this.setTmpUser(user || {});
            }
        }
    }

    _onSubmit() {
        const { onSubmit } = this.props;
        const { isRemember, tmpUser } = this.state;

        if (onSubmit) {
            onSubmit({...tmpUser}, isRemember);
        }
    }

    _onLogin() {
        const {onLogin} = this.props;
        const {tmpUser} = this.state;

        if (onLogin) {
            onLogin({...tmpUser});
        }
    }

    _onRegister() {
        const { onRegister } = this.props;
        const { tmpUser } = this.state;

        if (onRegister) {
            onRegister({...tmpUser});
        }
    }

    _toggleRemember() {
        const { isRemember } = this.state;
        this.setState({
            ...this.state,
            isRemember: !isRemember,
        })
    }

    onTmpUserChanged(name: string, value: string) {
        const { tmpUser } = this.state;
        const { user } = this.props;

        if (user) {
            let nextUser = {
                ...tmpUser,
                [name]: value
            };
            if (user[name] === value) {
                delete nextUser[name];
            }
            this.setTmpUser(nextUser);
        }
    }

    setTmpUser(user: UserInfoVM) {
        this.setState({
            ...this.state,
            tmpUser: user
        });
    }

    _onReload() {
        const { onReload } = this.props;
        if (onReload) {
            onReload();
        }
    }

    _onGetInfo() {
        const { onGetInfo } = this.props;
        if (onGetInfo) {
            onGetInfo();
        }
    }

    _onClose() {
        const { onClose } = this.props;
        if (onClose) {
            onClose();
        }

    }

    render() {
        const { className, isError, isUnregistered, isAuthPending, isLogin, isRegister, isAuthRequest, isLogout,
        user, admin, roles } = this.props;

        const { isRemember, tmpUser } = this.state;

        let cn = 'landing-panel d-flex flex-fill justify-content-center align-items-center';
        if (className) {
            cn += ` ${className}`;
        }
        // if (!isError && !isUnregistered && !isLogout) {
        //     cn += " bg-transparent"
        // }

        const originalValue = user ? user["role"] : '';
        const editValue = tmpUser ? tmpUser["role"] : '';

        let roleId = editValue ? editValue : originalValue;
        let roleTitle = '';
        if (roles && roles[roleId || ""]) {
            roleTitle = roles[roleId || ""].title;
        }
        else {
            roleTitle = roleId || "";
        }

        return (
            <div className={cn}>
                <div className={"d-flex flex-fill position-relative h-100"}>
                    <div className={"landing-page-background position-absolute"}/>
                    <div className={'d-flex flex-fill justify-content-around align-items-center'} style={{zIndex: 999}}>

                        <div className={"d-flex flex-column popup v-gap-5"}>
                            <div className={"text-selected font-weight-semi-bold px-5 pt-5"}>
                                <div>Existing Users</div>
                            </div>

                            <div className={"d-flex justify-content-end py-4 px-5 bg-advisory"}>
                                <Button text={"Sign In"} light={true} onClick={() => this._onLogin()}/>
                            </div>
                        </div>

                        <div className={"d-flex flex-column popup v-gap-5"}>
                            <div className={"text-selected font-weight-semi-bold px-5 pt-5"}>
                                <div>New Users</div>
                            </div>

                            <div className={"v-gap-5"}>
                                <div className={'register-grid px-5'}>
                                    <div className={"align-self-center display-3 font-weight-semi-bold justify-self-end"}>DoD ID:</div>
                                    <div className={"align-self-center display-3 font-weight-semi-bold justify-self-end"}>First Name:</div>
                                    <div className={"align-self-center display-3 font-weight-semi-bold justify-self-end"}>Last Name:</div>
                                    <div className={"align-self-center display-3 font-weight-semi-bold justify-self-end"}>Email:</div>
                                    <div className={"align-self-center display-3 font-weight-semi-bold justify-self-end"}>Phone:</div>
                                    <TextEdit value={tmpUser["dodId"] ? tmpUser["dodId"] : user?.dodId} name={"dodId"} autoFocus={true} placeholder={"DoD ID"} onSubmit={this.onTmpUserChanged}/>
                                    {/*<div className={"align-self-center text-info font-weight-light display-4"}>{user?.name}</div>*/}
                                    <TextEdit value={tmpUser["first_name"] ? tmpUser["first_name"] : user?.first_name} name={"first_name"} autoFocus={true} placeholder={"First Name"} onSubmit={this.onTmpUserChanged}/>
                                    <TextEdit value={tmpUser["last_name"] ? tmpUser["last_name"] : user?.last_name} name={"last_name"} autoFocus={true} placeholder={"Last Name"} onSubmit={this.onTmpUserChanged}/>
                                    <TextEdit value={tmpUser["email"] ? tmpUser["email"] : user?.email} name={"email"} autoFocus={true} placeholder={"Email Address"} onSubmit={this.onTmpUserChanged}/>
                                    <TextEdit value={tmpUser["phone"] ? tmpUser["phone"] : user?.phone} name={"phone"} placeholder={"Phone Number"} onSubmit={this.onTmpUserChanged}/>
                                </div>
                            </div>

                            <div className={"d-flex justify-content-end py-4 pr-5 bg-advisory"}>
                                <Button text={"Register"} light={true} onClick={() => this._onRegister()}/>
                            </div>
                        </div>

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
