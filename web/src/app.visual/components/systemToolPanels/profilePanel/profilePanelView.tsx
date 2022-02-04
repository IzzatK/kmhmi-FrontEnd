import React, {Component, Fragment} from 'react';
import './profilePanel.css';
import ProfileInfoView from "./profileInfoView";
import ScrollBar from "../../../theme/widgets/scrollBar/scrollBar";
import '../../../theme/stylesheets/panel.css';
import Button from "../../../theme/widgets/button/button";
import ComboBox from "../../../theme/widgets/comboBox/comboBox";
import TextEdit from "../../../theme/widgets/textEdit/textEdit";
import {arrayEquals, forEach} from "../../../../framework.visual/extras/utils/collectionUtils";
import {NewUserProfileInfoView} from "./newUserProfileInfoView";
import {bindInstanceMethods} from "../../../../framework/extras/typeUtils";
import {ProfilePanelProps, ProfilePanelState, UserInfoVM} from "./profilePanelModel";
import {UserRequestInfoView} from "./userRequestInfoView";
import SearchBox from "../../../theme/widgets/searchBox/searchBox";
import {userService} from "../../../../app.core/serviceComposition";

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
        }
    }

    componentDidMount() {
        const { currentUser } = this.props;

        this.setTmpUser(currentUser ? currentUser : {});


        // this should probably be in presenter...or somewhere other than...here
        if (this.props.permissions.canModify) {
            this.interval = setInterval(() => {
                userService.fetchUsers();
            }, 30000); // refresh every 60 seconds
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

        if (currentUser !== prevProps.currentUser) {
            this.refreshDirtyFlag();

            const {id} = currentUser || {};
            const {id: prevId } = prevProps.currentUser || {};

            if (id !== prevId) {
                this.setTmpUser(currentUser || {});
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
        console.log(value);
        const { onSearchTextChanged } = this.props;

        if (onSearchTextChanged) {
            onSearchTextChanged(value);
        }
    }

    setTmpUser(currentUser: UserInfoVM) {
        this.setState({
            ...this.state,
            tmpUser: currentUser
        }, () => this.refreshDirtyFlag());
    }

    refreshDirtyFlag() {
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

    onTmpUserChanged(name: string, value: string) {
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
            this.setTmpUser(nextUser);
        }
    }

    updateUser() {
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

    cancelEdit() {
        const { currentUser } = this.props;
        const { isDirty } = this.state;

        this.setState({
            ...this.state,
            isDirty: !isDirty,
            tmpUser: currentUser || {},
        }, () => this.refreshDirtyFlag());
    }

    addUser(newUser: UserInfoVM) {
        const { onUserAdded } = this.props;

        if (onUserAdded) {
            onUserAdded(newUser);
        }

        this.toggleIsAddingNewUser();
    }

    toggleEdit() {
        const { isDirty } = this.state;

        this.setState({
            ...this.state,
            isDirty: !isDirty,
        })
    }

    toggleIsAddingNewUser() {
        const { isAddingNewUser } = this.state;

        this.setState({
            ...this.state,
            isAddingNewUser: !isAddingNewUser,
        })
    }

    onAcceptUserRequest(id: string, role: string) {
        const { onAcceptUserRequest } = this.props;


        if (onAcceptUserRequest) onAcceptUserRequest(id, role);
    }

    onDeclineUserRequest(id: string) {
        const { onDeclineUserRequest } = this.props;

        if (onDeclineUserRequest) onDeclineUserRequest(id);
    }

    render() {
        const { className, users, currentUser, onUserUpdated, onUserRemoved, onUserAdded, roles, departments,
            accountStatuses, userLookUp, userRequests, permissions, searchText, ...rest } = this.props;

        const { editProperties, tmpUser, isDirty, isAddingNewUser } = this.state;

        let cn = "d-flex position-absolute w-100 h-100 align-items-center justify-content-center";

        let profileInfoViews;

        if (users) {
            profileInfoViews = users.map((user: UserInfoVM) => {
                return (
                    <ProfileInfoView permissions={permissions} currentUser={currentUser} roles={roles} departments={departments}
                                     accountStatuses={accountStatuses} user={user} onUserUpdated={onUserUpdated}
                                     onUserRemoved={onUserRemoved} userLookUp={userLookUp}/>
                )
            });
        }

        let userRequestViews;

        if (userRequests) {
            userRequestViews = userRequests.map((userRequest: UserInfoVM) => {
                return (
                    <UserRequestInfoView permissions={permissions} roles={roles} userRequest={userRequest} onAcceptUserRequest={this.onAcceptUserRequest}
                                         onDeclineUserRequest={this.onDeclineUserRequest}/>
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
                    } else {
                        roleTitle = roleId;
                    }
                    renderDiv =(
                        <TextEdit
                            className={cn}
                            disable={!readonly ? !isDirty : true}
                            placeholder={placeholder}
                            name={id}
                            dirty={!!editValue}
                            value={roleTitle || "N/A"}
                            edit={!readonly ? isDirty : false}
                            onSubmit={this.onTmpUserChanged}/>
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
                            className={cn}
                            disable={!readonly ? !isDirty : true}
                            placeholder={placeholder}
                            name={id}
                            dirty={!!editValue}
                            value={editValue ? editValue : originalValue}
                            edit={!readonly ? isDirty : false}
                            onSubmit={this.onTmpUserChanged}/>
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
                                        <Button text={"Edit"} orientation={"horizontal"} onClick={() => this.toggleEdit()} selected={false} disabled={false} className={"px-5"}/>
                                    }
                                </div>
                            }
                            {
                                isDirty &&
                                <div className={"d-flex justify-content-end h-gap-2"}>
                                    <Button text={"Cancel"} orientation={"horizontal"} onClick={() => this.cancelEdit()} selected={false} disabled={false} className={"px-5"}/>
                                    <Button text={"Save"} orientation={"horizontal"} onClick={() => this.updateUser()} selected={false} disabled={false} className={"px-5"}/>
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
                                    <ScrollBar renderTrackHorizontal={false}>

                                    </ScrollBar>
                                </div>

                                <div className={"search-box-container d-flex flex-column position-sticky v-gap-3 pb-5 position-sticky mr-4"}>
                                    <div className={"header d-flex align-items-center justify-content-between mt-3"}>
                                        <div className={'py-3'}>User Manager</div>
                                        {
                                            permissions.canCreate &&
                                            <Button text={"Add User"} orientation={"horizontal"} onClick={() => this.toggleIsAddingNewUser()} selected={false} disabled={false} className={"px-5 mr-5"}/>
                                        }
                                    </div>
                                    <div className={'mr-4'}>
                                        <div className={'v-gap-3 mr-4'}>
                                            <SearchBox placeholder={"Search for User"} onSearch={this._onSearch} text={searchText}
                                                       onTextChange={this._onSearchTextChanged} className={"mr-3 ml-5 position-sticky"}/>
                                        </div>
                                    </div>
                                </div>

                                <div className={'h-100 mr-4'}>
                                    <div className={'v-gap-3 mr-4'}>

                                        {
                                            isAddingNewUser &&
                                            <NewUserProfileInfoView permissions={permissions} onUserAdded={(newUser) => this.addUser(newUser)}
                                                                    onCancel={() => this.toggleIsAddingNewUser()}
                                                                    accountStatuses={accountStatuses} departments={departments}
                                                                    roles={roles}/>
                                        }
                                        {profileInfoViews}
                                    </div>
                                    {/*<ScrollBar renderTrackHorizontal={false}>*/}
                                    {/*    */}
                                    {/*</ScrollBar>*/}
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
