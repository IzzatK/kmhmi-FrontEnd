import React, {Component} from 'react';
import './profilePanel.css';
import Button from "../../../theme/widgets/button/button";
import Card from "../../../theme/widgets/card/card";
import ComboBox from "../../../theme/widgets/comboBox/comboBox";
import TextEdit from "../../../theme/widgets/textEdit/textEdit";
import {arrayEquals, forEach} from "../../../../framework.visual/extras/utils/collectionUtils";
import {bindInstanceMethods} from "../../../../framework/extras/typeUtils";
import {ProfilePanelProps, ProfilePanelState, UserInfoVM} from "./profilePanelModel";

class ProfileInfoView extends Component<ProfilePanelProps, ProfilePanelState> {

    constructor(props: any) {
        super(props);

        bindInstanceMethods(this);

        this.state = {
            tmpUser: {},
            isDirty: false,
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
            selected: false,
        }
    }

    componentDidMount() {
        const { user } = this.props;

        this.setTmpUser(user || {});
    }

    componentDidUpdate(prevProps: Readonly<ProfilePanelProps>, prevState: Readonly<ProfilePanelState>, snapshot?: any) {
        const { user } = this.props;

        if (user !== prevProps.user) {
            this.refreshDirtyFlag();

            const {id} = user || {};
            const {id: prevId } = prevProps.user || {};

            if (id !== prevId) {
                this.setTmpUser(user || {});
            }
        }
    }

    setTmpUser(user: UserInfoVM) {
        this.setState({
            ...this.state,
            tmpUser: user
        }, () => this.refreshDirtyFlag());
    }

    refreshDirtyFlag() {
        const {user} = this.props;
        const {tmpUser } = this.state;

        if (!user) return;

        let nextTmpUser = {
            ...tmpUser
        };
        let dirty = false;

        let keysToDelete = [];
        let itemKeys = Object.keys(nextTmpUser), itemsLength = itemKeys.length;
        for (let index = 0; index < itemsLength; index++) {
            let key = itemKeys[index];

            if (Array.isArray(tmpUser[key])) {
                if (arrayEquals(tmpUser[key], user[key])) {
                    keysToDelete.push(key)
                }
                else {
                    dirty = true;
                }
            }
            else {
                if (tmpUser[key] === user[key]) {
                    keysToDelete.push(key);
                }
                else {
                    dirty = true;
                }
            }
        }

        forEach(keysToDelete, (key: string) => {
            if (key !== 'id') {
                delete nextTmpUser[key];
            }
        })

        this.setState({
            ...this.state,
            tmpUser: nextTmpUser,
            isDirty: dirty
        })
    }

    onTmpUserChanged(name: string, value: string | undefined) {

        const {tmpUser} = this.state;
        const {user} = this.props;
        const {currentUser} = this.props;

        if (name === 'account_status' && value === 'Active') {
            if (user) {
                let nextUser: UserInfoVM = {
                    ...tmpUser,
                    [name]: value,
                    ['approved_by']: currentUser?  currentUser.id : "",
                    ['date_approved']: Date.now().toString(),
                };
                if (user[name] === value) {
                    delete nextUser[name];
                    delete nextUser['approved_by'];
                    delete nextUser['date_approved'];
                }
                this.setTmpUser(nextUser);
            }
        } else {
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
    }

    updateUser() {
        const { onUserUpdated } = this.props;
        const { isDirty, tmpUser } = this.state;

        this.setState({
            ...this.state,
            isDirty: !isDirty,
        });

        if (onUserUpdated) {
            onUserUpdated({...tmpUser});
        }
    }

    removeUser() {
        const { onUserRemoved, user } = this.props;

        if (user && onUserRemoved) {
            onUserRemoved(user.id || "");
        }
    }

    cancelEdit() {
        const { user } = this.props;

        this.setState({
            ...this.state,
            isDirty: false,
            tmpUser: user || {},
        }, () => this.refreshDirtyFlag());
    }

    toggleEdit() {
        this.setState({
            ...this.state,
            isDirty: true,
        })
    }

    toggleSelected() {
        const { onSelect } = this.props;
        const { selected } = this.state;

        this.setState({
            ...this.state,
            selected: !selected,
        })
        if (selected && onSelect) {
            onSelect();
        }
    }

    render() {
        const {user, currentUser, onSelect, onUserUpdated, onUserRemoved, roles, departments, accountStatuses, userLookUp, permissions } = this.props;

        const { isDirty, editProperties, tmpUser, selected } = this.state;

        let cn = "profile-info-header p-3 d-flex align-items-center justify-content-between";

        if (isDirty) {
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
                            className={cn}
                            disable={!isDirty}
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
                            disable={!isDirty}
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
                    } else {
                        accountStatusTitle = accountStatusId;
                    }

                    renderDiv = (
                        <ComboBox
                            className={cn}
                            disable={!isDirty}
                            onSelect={(value: string) => this.onTmpUserChanged(id, value)}
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
                            className={cn}
                            disable={!readonly ? !isDirty : true}
                            placeholder={placeholder}
                            name={id}
                            dirty={!!editValue}
                            value={name}
                            edit={!readonly ? isDirty : false}
                            onSubmit={this.onTmpUserChanged}/>
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
                            className={cn}
                            disable={!readonly ? !isDirty : true}
                            placeholder={placeholder}
                            name={id}
                            dirty={!!editValue}
                            value={editValue ? editValue : originalValue}
                            edit={!readonly ? isDirty : false}
                            onSubmit={this.onTmpUserChanged}/>
                    );
                    break;
            }

            return renderDiv;
        });

        return (
            <Card className={'profile-info flex-column justify-content-start header-4 align-items-stretch'}
                  header={
                      <div
                          onClick={() => this.toggleSelected()}
                          className={cn}>
                          <div className={'d-flex h-gap-4 px-5 py-4'}>
                              <div className={'header-1 font-weight-semi-bold'}>{user?.first_name + ' ' + user?.last_name}</div>
                          </div>

                          {/*<div className={"header-4"}>{Company}</div>*/}
                      </div>
                  }
                  body={
                      <div className={'p-3'}>
                          <div className={`personal-info-grid w-100 ${isDirty ? 'dirty' : ''}`}>
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
                              !isDirty &&
                              <div className={"d-flex justify-content-end h-gap-2"}>
                                  <Button text={"Edit"} orientation={"horizontal"} onClick={() => this.toggleEdit()} selected={false} disabled={false} className={"px-5"}/>
                              </div>
                          }
                          {
                              isDirty &&
                              <div className={"d-flex h-gap-2 justify-content-end"}>
                                  {
                                      permissions.canDelete &&
                                      <Button text={"Remove User"} orientation={"horizontal"} highlight={true} onClick={() => this.removeUser()} selected={false} disabled={false} className={"px-5"}/>
                                  }
                                  <Button text={"Cancel"} orientation={"horizontal"} highlight={true} onClick={() => this.cancelEdit()} selected={false} disabled={false} className={"px-5"}/>
                                  <Button text={"Save"} orientation={"horizontal"} onClick={() => this.updateUser()} selected={false} disabled={false} className={"px-5"}/>
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
