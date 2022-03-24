import React, {Component} from 'react';
import './profilePanel.css';
import Button from "../../theme/widgets/button/button";
import Card from "../../theme/widgets/card/card";
import ComboBox from "../../theme/widgets/comboBox/comboBox";
import TextEdit from "../../theme/widgets/textEdit/textEdit";
import {bindInstanceMethods} from "../../../framework.core/extras/utils/typeUtils";
import {ProfilePanelProps, ProfilePanelState} from "./profilePanelModel";
import Popup from "../../theme/widgets/popup/popup";
import {FileSVG} from "../../theme/svgs/fileSVG";
import {LoadingIndicator} from "../../theme/widgets/loadingIndicator/loadingIndicator";
import {Size} from "../../theme/widgets/loadingIndicator/loadingIndicatorModel";

class ProfileInfoView extends Component<ProfilePanelProps, ProfilePanelState> {

    constructor(props: any) {
        super(props);

        bindInstanceMethods(this);

        this.state = {
            showPopup: false,
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
                    placeholder: 'Department',
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
                // {
                //     id: 'dod_id',
                //     readonly: true
                // },
                {
                    id: 'account_status',
                    placeholder: 'Account Status',
                },
                {
                    id: 'approved_by',
                    placeholder: 'Approved By',
                    readonly: true,
                }
            ],
        }
    }

    _onTmpUserChanged(name: string, value: string) {
        const { onTmpUserChanged, user } = this.props;

        if (user && onTmpUserChanged) {
            const { id } = user;
            if (!id) return;

            onTmpUserChanged(id, name, value);
        }
    }

    _onUpdateUser() {
        const { onUserUpdated, user } = this.props;

        if (user && onUserUpdated) {
            const { id } = user;
            if (!id) return;

            onUserUpdated(id);
        }

        this._toggleEdit();
    }

    _onRemoveUser() {
        const { onUserRemoved, user } = this.props;

        if (user && onUserRemoved) {
            const { id } = user;
            if (!id) return;

            onUserRemoved(id);
        }

        this._setPopupVisible(false);
    }

    _setPopupVisible(visible: boolean) {
        this.setState({
            ...this.state,
            showPopup: visible,
        })
    }

    _onCancelEdit() {
        const { onCancel } = this.props;

        if (onCancel) {
            onCancel();
        }

        this._toggleEdit();
    }

    _toggleEdit() {
        const { onEdit } = this.props;

        if (onEdit) {
            onEdit();
        }
    }

    _toggleSelected() {
        const { onSelect } = this.props;

        if (onSelect) {
            onSelect();
        }
    }

    render() {
        const {user, tmpUser, roles, departments, accountStatuses, userLookUp, permissions, selected, dirty } = this.props;

        const { editProperties, showPopup } = this.state;

        let isUpdating = user?.isUpdating;

        let cn = "profile-info-header p-3 d-flex align-items-center justify-content-between position-relative";

        if (dirty) {
            cn += ` dirty`;
        }

        if (selected) {
            cn += ` selected`;
        }

        const editDivs = editProperties.map((editProperty) => {
            const { id, placeholder, readonly } = editProperty;

            const originalValue = user ? user[id] : '';
            const editValue = tmpUser ? tmpUser[id] : '';

            let renderDiv;
            let cn = 'align-self-center';

            switch (id) {
                case 'department':
                    let departmentId = editValue ? editValue : originalValue;
                    let departmentTitle = '';
                    if (departments && departments[departmentId]) {
                        departmentTitle = departments[departmentId].title;
                    }
                    else {
                        departmentTitle = departmentId;
                    }

                    renderDiv = (
                        <ComboBox
                            key={id}
                            className={cn}
                            disable={!dirty || isUpdating}
                            onSelect={(value: string) => this._onTmpUserChanged(id, value)}
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
                            key={id}
                            className={cn}
                            disable={!dirty || isUpdating}
                            onSelect={(value: string) => this._onTmpUserChanged(id, value)}
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
                    } else {
                        accountStatusTitle = accountStatusId;
                    }

                    renderDiv = (
                        <ComboBox
                            key={id}
                            className={cn}
                            disable={!dirty || isUpdating}
                            onSelect={(value: string) => this._onTmpUserChanged(id, value)}
                            title={accountStatusTitle}
                            items={accountStatuses}
                        />
                    );
                    break;
                case 'approved_by':
                    let name = originalValue;
                    let user = null;
                    if (userLookUp) {
                        user = userLookUp[name];
                    }
                    if (user) {
                        if (user.first_name) {
                            name = user.first_name
                        }
                        // if (user.middle_initial) {//TODO add middle initial to UserInfo
                        //     name += ` ${user.middle_initial}`;
                        // }
                        if (user.last_name) {
                            name += ` ${user.last_name}`;
                        }
                    }
                    renderDiv =(
                        <TextEdit
                            key={id}
                            className={cn}
                            disable={!readonly ? !dirty || isUpdating : true}
                            placeholder={placeholder}
                            name={id}
                            dirty={!!editValue}
                            value={name}
                            edit={!readonly ? dirty : false}
                            onSubmit={this._onTmpUserChanged}/>
                    )
                    break;
                case 'first_name':
                case 'last_name':
                case 'email_address':
                case 'phone_number':
                case 'dod_id':
                default:
                    renderDiv = (
                        <TextEdit
                            key={id}
                            className={cn}
                            disable={!readonly ? !dirty || isUpdating : true}
                            placeholder={placeholder}
                            name={id}
                            dirty={!!editValue}
                            value={editValue ? editValue : originalValue}
                            edit={!readonly ? dirty : false}
                            onSubmit={this._onTmpUserChanged}/>
                    );
                    break;
            }

            return renderDiv;
        });

        return (
            <Card className={'profile-info flex-column justify-content-start header-4 align-items-stretch'}
                  header={
                      <div
                          onClick={() => this._toggleSelected()}
                          className={cn}>
                          <div className={'d-flex h-gap-4 px-5 py-4'}>
                              <div className={'header-1 font-weight-semi-bold'}>{user?.first_name + ' ' + user?.last_name}</div>
                          </div>
                          {
                              isUpdating &&
                              <LoadingIndicator size={Size.small} className={"loading position-absolute"}/>
                          }
                          {/*<div className={"header-4"}>{Company}</div>*/}
                      </div>
                  }
                  body={
                      <div className={'p-3'}>
                          <Popup
                              text={"Are you sure you want to remove this User?"}
                              proceedText={"Remove"}
                              cancelText={"Cancel"}
                              graphic={FileSVG}
                              padding={"40%"}
                              isVisible={showPopup}
                              onCancel={() => this._setPopupVisible(false)}
                              onProceed={() => this._onRemoveUser()}/>
                          <div className={`personal-info-grid w-100 ${dirty ? 'dirty' : ''}`}>
                              <div className={'header-1 font-weight-semi-bold align-self-center justify-self-end'}>First Name:</div>
                              <div className={'header-1 font-weight-semi-bold align-self-center justify-self-end'}>Last Name:</div>
                              <div className={'header-1 font-weight-semi-bold align-self-center justify-self-end'}>Department:</div>
                              <div className={'header-1 font-weight-semi-bold align-self-center justify-self-end'}>Role:</div>
                              <div className={'header-1 font-weight-semi-bold align-self-center justify-self-end'}>Email:</div>
                              <div className={'header-1 font-weight-semi-bold align-self-center justify-self-end'}>Phone:</div>
                              {/*<div className={'header-1 font-weight-semi-bold align-self-center justify-self-end'}>DoD ID:</div>*/}
                              <div className={'header-1 font-weight-semi-bold align-self-center justify-self-end'}>Account Status:</div>
                              <div className={'header-1 font-weight-semi-bold align-self-center justify-self-end'}>Approved By:</div>
                              {editDivs}
                          </div>
                          {
                              !dirty &&
                              <div className={"d-flex justify-content-end h-gap-2"}>
                                  <Button text={"Edit"} orientation={"horizontal"} onClick={() => this._toggleEdit()} selected={false} disabled={isUpdating} className={"px-5"}/>
                              </div>
                          }
                          {
                              dirty &&
                              <div className={"d-flex h-gap-2 justify-content-end"}>
                                  {
                                      permissions.canDelete &&
                                      <Button text={"Remove User"} orientation={"horizontal"} highlight={true} onClick={() => this._setPopupVisible(true)} selected={false} disabled={isUpdating} className={"px-5"}/>
                                  }
                                  <Button text={"Cancel"} orientation={"horizontal"} highlight={true} onClick={() => this._onCancelEdit()} selected={false} disabled={isUpdating} className={"px-5"}/>
                                  <Button text={"Save"} orientation={"horizontal"} onClick={() => this._onUpdateUser()} selected={false} disabled={isUpdating} className={"px-5"}/>
                              </div>
                          }
                      </div>
                  }
                  selected={selected}
            />
        );
    }
}

export default ProfileInfoView;
