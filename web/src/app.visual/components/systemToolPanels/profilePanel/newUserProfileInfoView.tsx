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
            tmpUser: {},
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
                {
                    id: 'account_status',
                    placeholder: 'Account Status',
                },
            ],
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

        if (onUserAdded) {
            onUserAdded(tmpUser);
        }

        this.setState({
            ...this.state,
            tmpUser: {},
        });
    }

    cancel() {
        const { onCancel } = this.props;

        if (onCancel) {
            onCancel();
        }
    }

    render() {
        const { roles, departments, accountStatuses, } = this.props;
        const { tmpUser, editProperties, } = this.state;

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
                            className={cn}
                            placeholder={placeholder}
                            name={id}
                            dirty={!!editValue}
                            value={editValue ? editValue : originalValue}
                            edit={true}
                            onSubmit={this.onTmpUserChanged}/>
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
                              <div className={'header-1 font-weight-semi-bold align-self-center justify-self-end'}>First Name:</div>
                              <div className={'header-1 font-weight-semi-bold align-self-center justify-self-end'}>Last Name:</div>
                              <div className={'header-1 font-weight-semi-bold align-self-center justify-self-end'}>Department:</div>
                              <div className={'header-1 font-weight-semi-bold align-self-center justify-self-end'}>Role:</div>
                              <div className={'header-1 font-weight-semi-bold align-self-center justify-self-end'}>Email:</div>
                              <div className={'header-1 font-weight-semi-bold align-self-center justify-self-end'}>Phone:</div>
                              <div className={'header-1 font-weight-semi-bold align-self-center justify-self-end'}>DoD ID:</div>
                              <div className={'header-1 font-weight-semi-bold align-self-center justify-self-end'}>Account Status:</div>
                              {editDivs}
                          </div>
                          <div className={"d-flex h-gap-2 justify-content-end"}>
                              <Button text={"Cancel"} orientation={"horizontal"} onClick={() => this.cancel()} selected={false} disabled={false} className={"px-5"}/>
                              <Button text={"Save"} orientation={"horizontal"} onClick={() => this.addUser()} selected={false} disabled={false} className={"px-5"}/>
                          </div>
                      </div>
                  }
                  selected={true}
                  disabled={true}
            />
        );
    }
}
