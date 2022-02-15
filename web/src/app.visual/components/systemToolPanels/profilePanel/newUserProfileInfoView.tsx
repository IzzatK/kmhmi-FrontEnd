import React, {Component} from "react";
import './profilePanel.css';
import ComboBox from "../../../theme/widgets/comboBox/comboBox";
import TextEdit from "../../../theme/widgets/textEdit/textEdit";
import Card from "../../../theme/widgets/card/card";
import Button from "../../../theme/widgets/button/button";
import {bindInstanceMethods} from "../../../../framework/extras/typeUtils";
import {ProfilePanelProps, ProfilePanelState} from "./profilePanelModel";

export class NewUserProfileInfoView extends Component<ProfilePanelProps, ProfilePanelState> {
    constructor(props: any) {
        super(props);

        bindInstanceMethods(this);

        this.state = {
            tmpUser: {
                dod_id: '',
                first_name: '',
                last_name: '',
                email_address: '',
                phone_number: ''
            },
            editProperties: [
                {
                    id: 'first_name',
                    placeholder: 'First Name',
                },
                {
                    id: 'last_name',
                    placeholder: 'Last Name',
                },
                {
                    id: 'department',
                    placeholder: 'Department'
                },
                {
                    id: 'role',
                    placeholder: 'Role',
                },
                {
                    id: 'email_address',
                    placeholder: 'Email',
                },
                {
                    id: 'phone_number',
                    placeholder: 'Phone',
                },
                {
                    id: 'dod_id',
                    placeholder: 'DoD ID',
                },
                // {
                //     id: 'account_status',
                //     placeholder: 'Account Status',
                // },
            ],
            errorMessages: {
                "dod_id": "",
                "first_name": "",
                "last_name": "",
                "email_address": "",
                "phone_number": "",
            }
        }
    }

    onTmpUserChanged(name: string, value: string) {
        const { tmpUser } = this.state;

        if (tmpUser) {
            let nextUser = {
                ...tmpUser,
                [name]: value
            };

            this.setState({
                ...this.state,
                tmpUser: nextUser,
            })
        }
    }

    addUser() {
        const { onUserAdded } = this.props;
        const { tmpUser } = this.state;

        const { dod_id, first_name, last_name, email_address, phone_number } = tmpUser;

        let pass = true;

        let focus = false;

        let errorMessages: Record<string, string> = {
            "dod_id": "",
            "first_name": "",
            "last_name": "",
            "email_address": "",
            "phone_number": "",
        }

        if (dod_id && !/^[0-9]{10}/im.test(dod_id)) {
            pass = false;
            this._setFocus("dod_id");
            focus = true;
            errorMessages["dod_id"] = "Dod ID must be a 10-digit number";
        }

        if (first_name && !/\w/.test(first_name)) {
            pass = false;
            if (!focus) {
                this._setFocus("first_name");
                focus = true;
            }
            errorMessages["first_name"] = "First Name cannot be empty";
        }

        if (last_name && !/\w/.test(last_name)) {
            pass = false;
            if (!focus) {
                this._setFocus("last_name");
                focus = true;
            }
            errorMessages["last_name"] = "Last Name cannot be empty";
        }

        if (email_address && !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email_address)) {
            pass = false;
            if (!focus) {
                this._setFocus("email_address");
                focus = true;
            }
            errorMessages["email_address"] = "Email must be a valid email address";
        }

        if (phone_number && !/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im.test(phone_number)) {
            pass = false;
            if (!focus) {
                this._setFocus("phone_number");
            }
            errorMessages["phone_number"] = "Phone must be a valid phone number";
        }

        if (pass) {
            if (onUserAdded != null) {
                onUserAdded(tmpUser);
            }
            this.setState({
                ...this.state,
                tmpUser: {},
            });
        } else {
            this._setErrorMessages(errorMessages);
        }
    }

    _setErrorMessages(errorMessages: Record<string, string>) {
        this.setState({
            ...this.state,
            errorMessages: errorMessages,
        })
    }

    _setFocus(id: string) {
        document.getElementById(id)?.focus();
    }

    cancel() {
        const { onCancel } = this.props;

        if (onCancel) {
            onCancel();
        }
    }

    render() {
        const { roles, departments, accountStatuses, } = this.props;
        const { tmpUser, editProperties, errorMessages } = this.state;

        let disableButton = false;

        if (tmpUser["dod_id"] === "" || tmpUser["first_name"] === "" || tmpUser["last_name"] === "" || tmpUser["email_address"] === "" || tmpUser["phone_number"] === "") {
            disableButton = true;
        }

        const editDivs = editProperties.map((editProperty) => {
            const { id, placeholder } = editProperty;

            const originalValue = '';
            const editValue = tmpUser ? tmpUser[id] : '';

            let renderDiv;
            let cn = 'align-self-center';

            switch (id) {
                case 'department':
                    let departmentId = editValue ? editValue : originalValue;
                    let departmentTitle = '';
                    if ( departments && departments[departmentId]) {
                        departmentTitle = departments[departmentId].title;
                    }
                    else {
                        departmentTitle = departmentId;
                    }

                    renderDiv = (
                        <ComboBox
                            className={cn}
                            onSelect={(value: string) => this.onTmpUserChanged(id, value)}
                            title={departmentTitle}
                            items={departments}
                        />
                    );
                    break;
                case 'role':
                    let roleId = editValue ? editValue : originalValue;
                    let roleTitle = '';
                    if (roles && roles[roleId]) {
                        roleTitle = roles[roleId].title;
                    }
                    else {
                        roleTitle = roleId;
                    }

                    renderDiv = (
                        <ComboBox
                            className={cn}
                            onSelect={(value: string) => this.onTmpUserChanged(id, value)}
                            title={roleTitle}
                            items={roles}
                        />
                    );
                    break;
                case 'account_status':
                    let accountStatusId = editValue ? editValue : originalValue;
                    let accountStatusTitle = '';
                    if (accountStatuses && accountStatuses[accountStatusId]) {
                        accountStatusTitle = accountStatuses[accountStatusId].title;
                    }
                    else {
                        accountStatusTitle = accountStatusId;
                    }

                    renderDiv = (
                        <ComboBox
                            className={cn}
                            onSelect={(value: string) => this.onTmpUserChanged(id, value)}
                            title={accountStatusTitle}
                            items={accountStatuses}
                        />
                    );
                    break;
                case 'first_name':
                case 'last_name':
                case 'email_address':
                case 'phone_number':
                case 'dod_id':
                default:
                    renderDiv = (
                        <TextEdit
                            id={id}
                            className={cn}
                            placeholder={placeholder}
                            name={id}
                            dirty={!!editValue}
                            value={editValue ? editValue : originalValue}
                            edit={true}
                            onChange={(value) => this.onTmpUserChanged(id, value)}
                            autoFocus={id === "first_name"}/>
                    );
                    break;
            }

            return renderDiv;
        });

        return (
            <Card className={'profile-info new-user flex-column justify-content-start header-4 align-items-stretch'}
                  header={
                      <div className={'profile-info-header d-flex align-items-center justify-content-between dirty mt-3 mb-5 p-3'}>
                          <div className={'px-5 py-4 font-weight-semi-bold header-1'}>NEW USER</div>
                      </div>
                  }
                  body={
                      <div className={'px-3 pb-3'}>
                          <div className={"w-100 personal-info-grid dirty"}>
                              <div className={'d-flex align-self-center header-1 font-weight-semi-bold align-self-center justify-self-end h-gap-1'}>
                                  <div className={"text-notification"}>*</div>
                                  <div>First Name:</div>
                              </div>
                              <div className={'d-flex align-self-center header-1 font-weight-semi-bold align-self-center justify-self-end h-gap-1'}>
                                  <div className={"text-notification"}>*</div>
                                  <div>Last Name:</div>
                              </div>
                              <div className={'header-1 font-weight-semi-bold align-self-center justify-self-end'}>Department:</div>
                              <div className={'header-1 font-weight-semi-bold align-self-center justify-self-end'}>Role:</div>
                              <div className={'d-flex align-self-center header-1 font-weight-semi-bold align-self-center justify-self-end h-gap-1'}>
                                  <div className={"text-notification"}>*</div>
                                  <div>Email:</div>
                              </div>
                              <div className={'d-flex align-self-center header-1 font-weight-semi-bold align-self-center justify-self-end h-gap-1'}>
                                  <div className={"text-notification"}>*</div>
                                  <div>Phone:</div>
                              </div>
                              <div className={'d-flex align-self-center header-1 font-weight-semi-bold align-self-center justify-self-end h-gap-1'}>
                                  <div className={"text-notification"}>*</div>
                                  <div>DoD ID:</div>
                              </div>
                              {/*<div className={'header-1 font-weight-semi-bold align-self-center justify-self-end'}>Account Status:</div>*/}
                              <div/>
                              {editDivs}
                              <div/>
                              <div className={"d-flex align-items-center display-3 text-notification"}>{errorMessages ? errorMessages["first_name"] : ""}</div>
                              <div className={"d-flex align-items-center display-3 text-notification"}>{errorMessages ? errorMessages["last_name"] : ""}</div>
                              <div/>
                              <div/>
                              <div className={"d-flex align-items-center display-3 text-notification"}>{errorMessages ? errorMessages["email_address"] : ""}</div>
                              <div className={"d-flex align-items-center display-3 text-notification"}>{errorMessages ? errorMessages["phone_number"] : ""}</div>
                              <div className={"d-flex align-items-center display-3 text-notification"}>{errorMessages ? errorMessages["dod_id"] : ""}</div>
                              <div/>
                          </div>
                          <div className={"d-flex h-gap-2 align-items-center justify-content-end"}>
                              <Button text={"Cancel"} orientation={"horizontal"} onClick={() => this.cancel()} selected={false} disabled={false} className={"px-5"}/>
                              <Button text={"Save"} orientation={"horizontal"} onClick={() => this.addUser()} selected={false} disabled={disableButton} className={"px-5"}/>
                          </div>
                      </div>
                  }
                  selected={true}
                  disabled={true}
            />
        );
    }
}
