import React, {Component} from "react";
import './loginPanel.css';
import {LoginPanelProps, LoginPanelState, UserInfoVM} from "./loginPanelModel";
import {bindInstanceMethods, nameOf} from "../../../framework.core/extras/utils/typeUtils";
import Button from "../../theme/widgets/button/button";
import TextEdit from "../../theme/widgets/textEdit/textEdit";
import TextArea from "../../theme/widgets/textEdit/textArea";
import ComboBox from "../../theme/widgets/comboBox/comboBox";

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
                phone: '',
                department: '',
                registration_reason: '',
            },
            warning: "",
            errorMessages: {
                "dod_id": "",
                "first_name": "",
                "last_name": "",
                "email": "",
                "phone": "",
                "registration_reason": "",
            }
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

        const { dod_id, first_name, last_name, email, phone, registration_reason } = tmpUser;

        let warning = "";

        let failedFields = "";

        let pass = true;

        let focus = false;

        let errorMessages: Record<string, string> = {
            "dod_id": "",
            "first_name": "",
            "last_name": "",
            "email": "",
            "phone": "",
            "registration_reason": "",
        }

        if (!/^[0-9]{10}/im.test(dod_id)) {
            pass = false;
            failedFields += ` DoD ID`;
            this._setFocus("dod_id");
            focus = true;
            errorMessages["dod_id"] = "Dod ID must be a 10-digit number";
        }

        if (!/\w/.test(first_name)) {
            pass = false;
            failedFields += `${failedFields !== "" ? "," : ""} First Name`;
            if (!focus) {
                this._setFocus("first_name");
                focus = true;
            }
            errorMessages["first_name"] = "First Name cannot be empty";
        }

        if (!/\w/.test(last_name)) {
            pass = false;
            failedFields += `${failedFields !== "" ? "," : ""} Last Name`;
            if (!focus) {
                this._setFocus("last_name");
                focus = true;
            }
            errorMessages["last_name"] = "Last Name cannot be empty";
        }

        if (!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            pass = false;
            failedFields += `${failedFields !== "" ? "," : ""} Email`;
            if (!focus) {
                this._setFocus("email");
                focus = true;
            }
            errorMessages["email"] = "Email must be a valid email address";
        }

        if (phone !== "" && !/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im.test(phone)) {
            pass = false;
            failedFields += `${failedFields !== "" ? "," : ""} Phone`;
            if (!focus) {
                this._setFocus("phone");
            }
            errorMessages["phone"] = "Phone must be a valid phone number";
        }

        if (registration_reason === "") {
            pass = false;
            failedFields += `${failedFields !== "" ? "," : ""} Registration Reason`;
            if (!focus) {
                this._setFocus("registration_reason");
            }
            errorMessages["registration_reason"] = "Must provide a registration reason";
        }

        if (pass) {
            if (onRegister != null) {
                onRegister(tmpUser);
            }
        } else {
            warning = "Please correct the following fields:";
        }

        this._setWarnings(warning + failedFields, errorMessages);
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

    private onAgreement() {
        if (this.props.onAgreement != null) {
            this.props.onAgreement();
        }
    }

    _setWarnings(warning: string, errorMessages: Record<string, string>) {
        this.setState({
            ...this.state,
            warning: warning,
            errorMessages: errorMessages,
        })
    }

    _setFocus(id: string) {
        document.getElementById(id)?.focus();
    }

    render() {
        const { className, dodWarningAccepted, departments } = this.props;

        const { tmpUser, warning, errorMessages } = this.state;

        let cn = 'login-panel d-flex flex-fill justify-content-center align-items-center';
        if (className) {
            cn += ` ${className}`;
        }

        let disableButton = false;

        if (tmpUser["dod_id"] === "" || tmpUser["first_name"] === "" || tmpUser["last_name"] === "" ||
            tmpUser["email"] === "" || tmpUser["department"] === "" || tmpUser["registration_reason"] === "") {
            disableButton = true;
        }

        let departmentTitle = 'Select Department';
        if (departments && departments[tmpUser.department]) {
            departmentTitle = departments[tmpUser.department].title;
        }

        return (
            <div className={cn}>
                <div className={"d-flex flex-fill position-relative h-100"}>
                    {
                        !dodWarningAccepted &&
                        <div className={'position-relative flex-fill d-flex align-items-center justify-content-center'}>
                            <div className={'dod-warning-banner position-relative d-flex align-items-end justify-content-center shadow-lg'}>
                                <div className={'position-absolute pb-3'}>
                                    <Button onClick={this.onAgreement}>OK</Button>
                                </div>
                            </div>
                        </div>
                    }
                    {
                        dodWarningAccepted &&
                        <div className={'d-flex flex-fill justify-content-between'} style={{zIndex: 999}}>
                            <div className={"d-flex flex-fill align-items-center justify-content-center"}>
                                <div className={"d-flex flex-column shadow-lg"}>
                                    <div className={"d-flex flex-column light-popup v-gap-5"}>
                                        <div className={"d-flex text-selected font-weight-semi-bold px-5 pt-5"}>
                                            <div>Returning User</div>
                                        </div>
                                        <div className={"light-info px-5 text-wrap display-3"}>
                                            If you have already created a profile, click "submit" to access the CIC Knowledge Management Dashboard
                                        </div>
                                    </div>

                                    <div className={"d-flex justify-content-end py-4 pr-5 bg-advisory"}>
                                        <Button text={"I Already Have Access"} light={true} onClick={this._onLogin}/>
                                    </div>
                                </div>
                            </div>

                            <div className={"d-flex flex-column dark align-items-center justify-content-center"} style={{width: "60%"}}>
                                <div className={"d-flex flex-column shadow-lg"}>
                                    <div className={"d-flex flex-column popup v-gap-5"}>
                                        <div className={"text-selected font-weight-semi-bold px-5 pt-5"}>
                                            <div>New User</div>
                                        </div>
                                        <div className={"info px-5 display-3"}>New to the Dashboard? Submit your information below to request authorization</div>
                                        <div className={"v-gap-5"}>
                                            <div className={'register-grid px-5'}>
                                                <div className={"d-flex align-self-center justify-self-end h-gap-1 display-3 font-weight-semi-bold"}>
                                                    <div className={"required-field"}>*</div>
                                                    <div>DoD ID:</div>
                                                </div>
                                                <div className={"d-flex align-self-center justify-self-end h-gap-1 display-3 font-weight-semi-bold"}>
                                                    <div className={"required-field"}>*</div>
                                                    <div>First Name:</div>
                                                </div>
                                                <div className={"d-flex align-self-center justify-self-end h-gap-1 display-3 font-weight-semi-bold"}>
                                                    <div className={"required-field"}>*</div>
                                                    <div>Last Name:</div>
                                                </div>
                                                <div className={"d-flex align-self-center justify-self-end h-gap-1 display-3 font-weight-semi-bold"}>
                                                    <div className={"required-field"}>*</div>
                                                    <div>Email:</div>
                                                </div>
                                                <div className={"d-flex align-self-center justify-self-end h-gap-1 display-3 font-weight-semi-bold"}>
                                                    <div>Phone:</div>
                                                </div>
                                                <div className={"d-flex align-self-center justify-self-end h-gap-1 display-3 font-weight-semi-bold"}>
                                                    <div className={"required-field"}>*</div>
                                                    <div>Department:</div>
                                                </div>
                                                <div className={"d-flex align-self-center justify-self-end h-gap-1 display-3 font-weight-semi-bold"}>
                                                    <div className={"required-field"}>*</div>
                                                    <div>Reason:</div>
                                                </div>
                                                <TextEdit
                                                    id={"dod_id"}
                                                    value={tmpUser.dod_id}
                                                    name={nameOf<UserInfoVM>("dod_id")}
                                                    autoFocus={true}
                                                    placeholder={""}
                                                    onChange={(value) => this.onTmpUserChanged("dod_id", value)}
                                                />
                                                {/*<div className={"align-self-center text-info font-weight-light display-4"}>{user?.name}</div>*/}
                                                <TextEdit
                                                    id={"first_name"}
                                                    value={tmpUser.first_name}
                                                    name={nameOf<UserInfoVM>("first_name")}
                                                    placeholder={""}
                                                    onChange={(value) => this.onTmpUserChanged("first_name", value)}/>
                                                <TextEdit
                                                    id={"last_name"}
                                                    value={tmpUser.last_name}
                                                    name={nameOf<UserInfoVM>("last_name")}
                                                    placeholder={""}
                                                    onChange={(value) => this.onTmpUserChanged("last_name", value)}/>
                                                <TextEdit
                                                    id={"email"}
                                                    value={tmpUser.email}
                                                    name={nameOf<UserInfoVM>("email")}
                                                    placeholder={""}
                                                    onChange={(value) => this.onTmpUserChanged("email", value)}/>
                                                <TextEdit
                                                    id={"phone"}
                                                    value={tmpUser.phone}
                                                    name={nameOf<UserInfoVM>("phone")}
                                                    placeholder={""}
                                                    onChange={(value) => this.onTmpUserChanged("phone", value)}/>
                                                <ComboBox
                                                    id={"department"}
                                                    onSelect={(value: string) => this.onTmpUserChanged("department", value)}
                                                    title={departmentTitle}
                                                    items={departments}
                                                />
                                                <TextArea
                                                    id={"registration_reason"}
                                                    value={tmpUser.registration_reason}
                                                    name={nameOf<UserInfoVM>("registration_reason")}
                                                    placeholder={"Please provide organizational affiliation and reason for accessing the CIC Knowledge Management System"}
                                                    onChange={(value) => this.onTmpUserChanged("registration_reason", value)}
                                                />
                                                {/*<div className={"d-flex align-items-center display-3 text-notification"}>{errorMessages["dod_id"]}</div>*/}
                                                {/*<div className={"d-flex align-items-center display-3 text-notification"}>{errorMessages["first_name"]}</div>*/}
                                                {/*<div className={"d-flex align-items-center display-3 text-notification"}>{errorMessages["last_name"]}</div>*/}
                                                {/*<div className={"d-flex align-items-center display-3 text-notification"}>{errorMessages["email"]}</div>*/}
                                                {/*<div className={"d-flex align-items-center display-3 text-notification"}>{errorMessages["phone"]}</div>*/}
                                                {/*<div className={"d-flex align-items-center display-3 text-notification"}>{errorMessages["registration_reason"]}</div>*/}
                                            </div>
                                        </div>

                                        <div className={"display-3 ml-5 pl-5 required-field"}>* Required fields</div>
                                    </div>

                                    <div className={"d-flex justify-content-end py-4 pr-5 bg-advisory align-items-center h-gap-3"}>
                                        <div className={"display-4 font-weight-semi-bold"}>{warning}</div>
                                        <Button text={"Submit"} light={true} onClick={() => this._onRegister()} disabled={disableButton}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }

                </div>
            </div>
        )
    }
}

export default LoginPanelView;
