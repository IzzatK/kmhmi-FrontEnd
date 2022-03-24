import React, {Component, Fragment} from 'react';
import './profilePanel.css';
import ProfileInfoView from "./profileInfoView";
import ScrollBar from "../../theme/widgets/scrollBar/scrollBar";
import '../../theme/stylesheets/panel.css';
import Button from "../../theme/widgets/button/button";
import ComboBox from "../../theme/widgets/comboBox/comboBox";
import TextEdit from "../../theme/widgets/textEdit/textEdit";
import {arrayEquals, forEach, forEachKVP} from "../../../framework.core/extras/utils/collectionUtils";
import {NewUserProfileInfoView} from "./newUserProfileInfoView";
import {bindInstanceMethods} from "../../../framework.core/extras/utils/typeUtils";
import {ProfilePanelProps, ProfilePanelState, UserInfoVM} from "./profilePanelModel";
import {UserRequestInfoView} from "./userRequestInfoView";
import SearchBox from "../../theme/widgets/searchBox/searchBox";
import {userService} from "../../../serviceComposition";

class ProfilePanelView extends Component<ProfilePanelProps, ProfilePanelState> {

    interval!: NodeJS.Timer;

    constructor(props: any) {
        super(props);

        bindInstanceMethods(this);

        this.state = {
            tmpUser: {},
            isDirty: false,
            isAddingNewUser: false,
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
                    readonly: true,
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
                //     placeholder: 'DoD ID',
                //     readonly: true
                // },
                {
                    id: 'account_status',
                    placeholder: 'Account Status',
                    readonly: true
                },
            ],
            isOpen: {},
            isEdit: {},
            tmpUsers: {},
        }
    }

    componentDidMount() {
        const { currentUser } = this.props;

        if (currentUser) {
            const { id } = currentUser;

            this._setTmpUser({id});
        }

        // this should probably be in presenter...or somewhere other than...here
        if (this.props.permissions.canModify) {
            this.interval = setInterval(() => {
                userService.fetchUsers();
            }, 60000); // refresh every 60 seconds
            userService.fetchUsers();
        }
    }

    componentWillUnmount() {
        if (this.interval != null) {
            clearInterval(this.interval);
        }
    }

    componentDidUpdate(prevProps: Readonly<ProfilePanelProps>, prevState: Readonly<ProfilePanelState>, snapshot?: any) {
        const { currentUser } = this.props;

        if (currentUser && prevProps.currentUser) {
            if (currentUser.id !== "" && prevProps.currentUser.id !== "") {
                if (currentUser !== prevProps.currentUser) {
                    this._refreshDirtyFlag();

                    const {id} = currentUser;
                    const {id: prevId } = prevProps.currentUser;

                    if (id !== prevId) {
                        this._setTmpUser({ id });
                    }
                }
            }
        }
    }

    _onSearch() {
        const { onSearch } = this.props;

        if (onSearch) {
            onSearch();
        }
    }

    _onSearchTextChanged(value: string) {
        const { onSearchTextChanged } = this.props;

        if (onSearchTextChanged) {
            onSearchTextChanged(value);
        }
    }

    _onClearSearch() {
        const { onClearSearch } = this.props;

        if (onClearSearch) {
            onClearSearch();
        }
    }

    _setTmpUser(currentUser: UserInfoVM) {
        this.setState({
            ...this.state,
            tmpUser: currentUser
        }, () => this._refreshDirtyFlag());
    }

    _refreshDirtyFlag() {
        const {currentUser} = this.props;
        const {tmpUser} = this.state;

        if (!currentUser) return;

        let nextTmpUser = {
            ...tmpUser
        };
        let dirty = false;

        let keysToDelete = [];
        let itemKeys = Object.keys(nextTmpUser), itemsLength = itemKeys.length;
        for (let index = 0; index < itemsLength; index++) {
            let key = itemKeys[index];

            if (tmpUser) {
                if (Array.isArray(tmpUser[key])) {
                    if (arrayEquals(tmpUser[key], currentUser[key])) {
                        keysToDelete.push(key)
                    }
                    else {
                        dirty = true;
                    }
                }
                else {
                    if (tmpUser[key] === currentUser[key]) {
                        keysToDelete.push(key);
                    }
                    else {
                        dirty = true;
                    }
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

    _onTmpUserChanged(name: string, value: string) {
        const {tmpUser} = this.state;
        const {currentUser} = this.props;

        if (currentUser) {
            let nextUser = {
                ...tmpUser,
                [name]: value
            };
            if (currentUser[name] === value) {
                delete nextUser[name];
            }
            this._setTmpUser(nextUser);
        }
    }

    _onTmpUsersChanged(id: string, name: string, value: string) {
        const { tmpUsers } = this.state;
        if (!tmpUsers) return;

        let tmpUsersCopy: Record<string, UserInfoVM> = {};

        if (Object.keys(tmpUsers).length === 0) {
            tmpUsersCopy[id] = {
                id,
                [name]: value,
            }
        } else {
            forEachKVP(tmpUsers, (itemKey: string, itemValue: UserInfoVM) => {
                const { id:tmpUserId } = itemValue;
                if (!tmpUserId) return;

                if (tmpUserId === id) {
                    if (tmpUsers[id]) {
                        tmpUsersCopy[id] = {
                            ...tmpUsers[id],
                            [name]: value,
                        }
                    } else {
                        tmpUsersCopy[id] = {
                            id,
                            [name]: value,
                        }
                    }
                } else {
                    tmpUsersCopy[tmpUserId] = tmpUsers[tmpUserId];
                }
            })
        }

        this.setState({
            ...this.state,
            tmpUsers: tmpUsersCopy,
        })
    }

    _onUpdateCurrentUser() {
        const { onUserUpdated } = this.props;
        const { isDirty, tmpUser } = this.state;

        this.setState({
            ...this.state,
            isDirty: !isDirty,
        })
        if (onUserUpdated) {
            onUserUpdated({...tmpUser});
        }
    }

    _onUpdateUser(id: string) {
        const { onUserUpdated } = this.props;
        const { tmpUsers } = this.state;

        if (!tmpUsers) return;

        let updatedUser: UserInfoVM = {}
        if (tmpUsers[id]) {
            updatedUser = tmpUsers[id];
        }

        if (onUserUpdated) {
            onUserUpdated({...updatedUser});
        }
    }

    _onCancelCurrentUserEdit() {
        const { currentUser } = this.props;
        const { isDirty } = this.state;

        if (currentUser) {
            const { id } = currentUser;

            this.setState({
                ...this.state,
                isDirty: !isDirty,
                tmpUser: {id},
            }, () => this._refreshDirtyFlag());
        }
    }

    _onCancelEdit(id: string) {
        const { tmpUsers } = this.state;

        if (!tmpUsers) return;

        let tmpUsersCopy: Record<string, UserInfoVM> = {};

        forEachKVP(tmpUsers, (itemKey: string, itemValue: UserInfoVM) => {
            const { id:tmpUserId } = itemValue;

            if (!tmpUserId) return;

            if (tmpUserId !== id) {
                tmpUsersCopy[tmpUserId] = tmpUsers[tmpUserId];
            }
        })

        this.setState({
            ...this.state,
            tmpUsers: tmpUsersCopy,
        })
    }

    _onRemoveUser(id: string) {
        const { onUserRemoved } = this.props;

        if (onUserRemoved) {
            onUserRemoved(id);
        }

        this._refreshState(id);
    }

    _onAddUser(newUser: UserInfoVM) {
        const { onUserAdded } = this.props;

        if (onUserAdded) {
            onUserAdded(newUser);
        }

        this._toggleIsAddingNewUser();
    }

    _toggleEdit() {
        const { isDirty } = this.state;

        this.setState({
            ...this.state,
            isDirty: !isDirty,
        })
    }

    _toggleIsAddingNewUser() {
        const { isAddingNewUser } = this.state;

        this.setState({
            ...this.state,
            isAddingNewUser: !isAddingNewUser,
        })
    }

    _onAcceptUserRequest(id: string) {
        const { onAcceptUserRequest } = this.props;
        const { tmpUsers } = this.state;


        if (!tmpUsers) return;
        if (tmpUsers[id]) {
            const { role } = tmpUsers[id];
            if (!role) return;

            if (onAcceptUserRequest) {
                onAcceptUserRequest(id, role);
            }
        }
    }

    _onDeclineUserRequest(id: string) {
        const { onDeclineUserRequest } = this.props;

        if (onDeclineUserRequest) {
            onDeclineUserRequest(id);
        }

        this._refreshState(id);
    }

    _refreshState(id: string) {
        const { tmpUsers, isOpen, isEdit } = this.state;
        if (!tmpUsers) return;

        let tmpUsersCopy: Record<string, UserInfoVM> = {};

        forEachKVP(tmpUsers, (itemKey: string, itemValue: UserInfoVM) => {
            const { id:tmpUserId } = itemValue;

            if (!tmpUserId) return;

            if (tmpUserId !== id) {
                tmpUsersCopy[tmpUserId] = tmpUsers[tmpUserId];
            }
        });

        let isOpenCopy: Record<string, string> = {};

        if (isOpen) {
            forEachKVP(isOpen, (itemKey: string, itemValue: string) => {
                if (itemValue !== id) {
                    isOpenCopy[itemValue] = isOpen[itemValue];
                }
            });
        }

        let isEditCopy: Record<string, string> = {};

        if (isEdit) {
            forEachKVP(isEdit, (itemKey: string, itemValue: string) => {
                if (itemValue !== id) {
                    isEditCopy[itemValue] = isEdit[itemValue];
                }
            });
        }

        this.setState({
            ...this.state,
            tmpUsers: tmpUsersCopy,
            isOpen: isOpenCopy,
            isEdit: isEditCopy,
        })
    }

    _manageIsOpen(id: string) {
        const { isOpen } = this.state;

        if (isOpen) {
            let isOpenCopy: Record<string, string> = {};

            if (!isOpen[id]) {
                isOpenCopy[id] = id;
            }

            forEachKVP(isOpen, (itemKey: string, itemValue: string) => {
                if (itemValue !== id) {
                    isOpenCopy[itemValue] = itemValue;
                }
            });

            this.setState({
                ...this.state,
                isOpen: isOpenCopy,
            })
        }
    }

    _manageIsEdit(id: string) {
        const { isEdit } = this.state;

        if (isEdit) {
            let isEditCopy: Record<string, string> = {};

            if (!isEdit[id]) {
                isEditCopy[id] = id;
            }

            forEachKVP(isEdit, (itemKey: string, itemValue: string) => {
                if (itemValue !== id) {
                    isEditCopy[itemValue] = itemValue;
                }
            });

            this.setState({
                ...this.state,
                isEdit: isEditCopy,
            })
        }
    }

    render() {
        const { className, users, currentUser, onUserUpdated, onUserRemoved, onUserAdded, roles, departments,
            accountStatuses, userLookUp, userRequests, permissions, searchText } = this.props;

        const { editProperties, tmpUser, tmpUsers, isDirty, isAddingNewUser, isOpen, isEdit } = this.state;

        let cn = "d-flex position-absolute w-100 h-100 align-items-center justify-content-center";

        let profileInfoViews;

        if (users) {
            profileInfoViews = users.map((user: UserInfoVM) => {
                const { id } = user;

                if (!id) return;

                let componentOpen = false;

                if (isOpen) {
                    componentOpen = isOpen[id] !== undefined;
                }

                let componentEdit = false;

                if (isEdit) {
                    componentEdit = isEdit[id] !== undefined;
                }

                let tmpUserProp: UserInfoVM = {}
                if (tmpUsers) {
                    if (tmpUsers[id]) {
                        tmpUserProp = tmpUsers[id];
                    }
                }

                return (
                    <ProfileInfoView permissions={permissions}
                                     currentUser={currentUser}
                                     roles={roles}
                                     departments={departments}
                                     accountStatuses={accountStatuses}
                                     user={user}
                                     tmpUser={tmpUserProp}
                                     onUserUpdated={() => this._onUpdateUser(id)}
                                     onUserRemoved={() => this._onRemoveUser(id)}
                                     onTmpUserChanged={(id, name, value) => this._onTmpUsersChanged(id, name, value)}
                                     userLookUp={userLookUp}
                                     dirty={componentEdit}
                                     selected={componentOpen}
                                     onSelect={() => this._manageIsOpen(id)}
                                     onEdit={() => this._manageIsEdit(id)}
                                     onCancel={() => this._onCancelEdit(id)}
                                     key={id}
                    />
                )
            });
        }

        let userRequestViews;

        if (userRequests) {
            userRequestViews = userRequests.map((userRequest: UserInfoVM) => {
                const { id } = userRequest;
                if (!id) return;

                let componentOpen = false;

                if (isOpen) {
                    componentOpen = isOpen[id] !== undefined;
                }

                let tmpUserProp: UserInfoVM = {};

                if (tmpUsers) {
                    if (tmpUsers[id]) {
                        tmpUserProp = tmpUsers[id];
                    }
                }

                return (
                    <UserRequestInfoView permissions={permissions}
                                         roles={roles}
                                         userRequest={userRequest}
                                         tmpUser={tmpUserProp}
                                         onAcceptUserRequest={this._onAcceptUserRequest}
                                         onDeclineUserRequest={this._onDeclineUserRequest}
                                         onTmpUserChanged={(id, name, value) => this._onTmpUsersChanged(id, name, value)}
                                         selected={componentOpen}
                                         onSelect={() => this._manageIsOpen(id)}/>
                )
            })
        }

        const editDivs = editProperties.map((editProperty) => {
            const { id, placeholder, readonly } = editProperty;

            const originalValue = currentUser ? currentUser[id] : '';
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
                            disable={!isDirty}
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
                    } else {
                        roleTitle = roleId;
                    }
                    renderDiv =(
                        <TextEdit
                            key={id}
                            className={cn}
                            disable={!readonly ? !isDirty : true}
                            placeholder={placeholder}
                            name={id}
                            dirty={!!editValue}
                            value={roleTitle || "N/A"}
                            edit={!readonly ? isDirty : false}
                            onSubmit={this._onTmpUserChanged}/>
                    )
                    break;
                case 'first_name':
                case 'last_name':
                case 'email_address':
                case 'phone_number':
                case 'account_status':
                default:
                    renderDiv = (
                        <TextEdit
                            key={id}
                            className={cn}
                            disable={!readonly ? !isDirty : true}
                            placeholder={placeholder}
                            name={id}
                            dirty={!!editValue}
                            value={editValue ? editValue : originalValue}
                            edit={!readonly ? isDirty : false}
                            onSubmit={this._onTmpUserChanged}/>
                    );
            }
            return renderDiv;
        });

        return (
            <div className={cn}>
                <div className={'profile-panel system-tool-panel flex-fill h-100 py-4 pl-4 d-flex flex-column'}>
                    <div className={'header-1 title py-3'}>PROFILE MANAGER</div>

                    <ScrollBar renderTrackHorizontal={false}>
                        <div className={`header mt-3 d-flex align-items-center justify-content-start mr-4 ${isDirty ? 'dirty' : ''}`}>
                            <div className={'d-flex h-gap-3 align-items-center py-3'}>
                                <div>PERSONAL INFORMATION</div>
                            </div>
                        </div>

                        <div className={'p-3 mr-4'}>
                            <div className={'personal-info-grid w-100'}>
                                <div className={'header-1 font-weight-semi-bold align-self-center justify-self-end '}>First Name:</div>
                                <div className={'header-1 font-weight-semi-bold align-self-center justify-self-end'}>Last Name:</div>
                                <div className={'header-1 font-weight-semi-bold align-self-center justify-self-end'}>Department:</div>
                                <div className={'header-1 font-weight-semi-bold align-self-center justify-self-end'}>Role:</div>
                                <div className={'header-1 font-weight-semi-bold align-self-center justify-self-end'}>Email:</div>
                                <div className={'header-1 font-weight-semi-bold align-self-center justify-self-end'}>Phone:</div>
                                {/*<div className={'header-1 font-weight-semi-bold align-self-center justify-self-end'}>DoD ID:</div>*/}
                                <div className={'header-1 font-weight-semi-bold align-self-center justify-self-end'}>Account Status:</div>
                                {editDivs}
                            </div>
                            {
                                !isDirty &&
                                <div className={"d-flex justify-content-end h-gap-2"}>
                                    {
                                        permissions.canModifySelf &&
                                        <Button text={"Edit"} orientation={"horizontal"} onClick={() => this._toggleEdit()} selected={false} disabled={false} className={"px-5"}/>
                                    }
                                </div>
                            }
                            {
                                isDirty &&
                                <div className={"d-flex justify-content-end h-gap-2"}>
                                    <Button text={"Cancel"} orientation={"horizontal"} onClick={() => this._onCancelCurrentUserEdit()} selected={false} disabled={false} className={"px-5"}/>
                                    <Button text={"Save"} orientation={"horizontal"} onClick={() => this._onUpdateCurrentUser()} selected={false} disabled={false} className={"px-5"}/>
                                </div>
                            }
                        </div>
                        {
                            permissions.canModify &&
                            <Fragment>
                                <div className={"header d-flex align-items-center justify-content-between mt-3 mb-5 mr-4"}>
                                    <div className={'py-3'}>User Requests</div>
                                </div>
                                <div className={'mr-4'}>
                                    <div className={'v-gap-3 mr-4'}>
                                        {userRequestViews}
                                    </div>
                                </div>

                                <div className={"search-box-container d-flex flex-column position-sticky v-gap-3 pb-5 position-sticky mr-4"}>
                                    <div className={"header d-flex align-items-center justify-content-between mt-3"}>
                                        <div className={'py-3'}>User Manager</div>
                                        {
                                            permissions.canCreate &&
                                            <Button text={"Add User"} orientation={"horizontal"} onClick={() => this._toggleIsAddingNewUser()} selected={false} disabled={false} className={"px-5 mr-5"}/>
                                        }
                                    </div>
                                    <div className={'mr-4'}>
                                        <div className={'d-flex mr-4 align-items-center'}>
                                            <SearchBox placeholder={"Search for User"} onSearch={this._onSearch} text={searchText}
                                                       onTextChange={this._onSearchTextChanged} className={"w-100 mr-3 ml-5 position-sticky"}/>
                                            <Button text={"Clear"} className={"clear-button"} onClick={() => this._onClearSearch()}/>
                                        </div>
                                    </div>
                                </div>

                                <div className={'h-100 mr-4'}>
                                    <div className={'v-gap-3 mr-4'}>

                                        {
                                            isAddingNewUser &&
                                            <NewUserProfileInfoView permissions={permissions}
                                                                    onUserAdded={(newUser) => this._onAddUser(newUser)}
                                                                    onCancel={() => this._toggleIsAddingNewUser()}
                                                                    accountStatuses={accountStatuses}
                                                                    departments={departments}
                                                                    roles={roles}/>
                                        }
                                        {profileInfoViews}
                                    </div>
                                </div>
                            </Fragment>
                        }
                    </ScrollBar>

                </div>
            </div>
        );
    }
}

export default ProfilePanelView;
