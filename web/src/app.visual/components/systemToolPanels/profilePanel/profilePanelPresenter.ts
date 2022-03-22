import ProfilePanelView from "./profilePanelView";
import {Presenter} from "../../../../framework.visual";
import {createComponentWrapper} from "../../../../framework.visual";
import {forEach, forEachKVP} from "../../../../framework.core/extras/utils/collectionUtils";
import {createSelector} from "@reduxjs/toolkit";
import {ReferenceType, UserInfo} from "../../../../app.model";
import {
    authorizationService,
    referenceService,
    userService
} from "../../../../serviceComposition";
import {AccountStatusVM, DepartmentVM, RoleVM, UserInfoVM} from "./profilePanelModel";
import {AuthenticationStatus, PERMISSION_ENTITY, PERMISSION_OPERATOR} from "../../../../app.core.api";
import {RegistrationStatusType} from "../../../model/registrationStatusType";

class ProfilePanel extends Presenter {
    private readonly accountStatuses: AccountStatusVM[];
    constructor() {
        super();

        this.id ='app.visual/components/profilePanel';

        this.view = ProfilePanelView;

        this.displayOptions = {
            containerId: 'system-tool-panel',
            visible: false,
            appearClass: 'fadeIn',
            enterClass: 'fadeIn',
        };

        // this does not belong here
        this.accountStatuses = [
            {
                id: RegistrationStatusType.CREATED,
                title: 'Created',
            },
            {
                id: RegistrationStatusType.ACTIVE,
                title: 'Active',
            },
            {
                id: RegistrationStatusType.NONE,
                title: 'Inactive',
            },
        ]

        this.mapStateToProps = (state: any, props: any) => {
            return {
                users: this.getManagedUserVMs(state),
                userLookUp: userService.getActiveUsers(),
                currentUser: this.getCurrentUserVM(state),
                roles: this.getRolesVMs(state),
                departments: this.getDepartmentVMs(state),
                accountStatuses: this.accountStatuses,
                permissions: this.getPermissions(state),
                userRequests: this.getUserRequestVMs(state),
                searchText: userService.getSearchText(),
            }
        }

        this.mapDispatchToProps = () => {
            return {
                onUserAdded: (user: UserInfoVM) => userService.createUser(user),
                onUserUpdated: (user: UserInfoVM) => userService.updateUser(this.convertUserInfoVMToUserInfo(user)),
                onUserRemoved: (id: string) => userService.removeUser(id),
                onAcceptUserRequest: (id: string, role: string) => userService.acceptUserRequest(id, role),
                onDeclineUserRequest: (id: string) => userService.declineUserRequest(id),
                onSearch: () => userService.fetchUsers(),
                onSearchTextChanged: (value: string) => userService.setSearchText(value),
                onClearSearch: () => userService.clearSearch(),
            };
        }
    }

    convertUserInfoVMToUserInfo = (userInfoVM: UserInfoVM) => {
        const { id, first_name, last_name, email_address, phone_number, department, account_status: registration_status, role,
            date_approved, dod_id, approved_by } = userInfoVM;

        let account_status: AuthenticationStatus = AuthenticationStatus.ACTIVE;

        if (registration_status) {
            switch (registration_status) {
                case RegistrationStatusType.ACTIVE:
                    account_status = AuthenticationStatus.ACTIVE;
                    break;
                case RegistrationStatusType.CREATED:
                    account_status = AuthenticationStatus.CREATED;
                    break;
                case RegistrationStatusType.REJECTED:
                    account_status = AuthenticationStatus.REJECTED;
                    break;
                default:
                    account_status = AuthenticationStatus.NONE;
                    break;
            }
        }

        let user: UserInfo = new UserInfo(id || "");

        user.account_status = account_status;
        user.department = department || "";
        user.dod_id = dod_id || "";
        user.email_address = email_address || "";
        user.first_name = first_name || "";
        user.last_name = last_name || "";
        user.phone_number = phone_number || "";
        user.role = role || "";

        return user;
    }

    getPermissions = createSelector(
        [(s) => userService.getCurrentUserId(), (s) => authorizationService.getPermissions()],
        (currentUserId, permissionInfoLookup) => {

            return {
                canModifySelf: authorizationService.hasPermission(PERMISSION_ENTITY.USER, PERMISSION_OPERATOR.MODIFY, currentUserId, currentUserId),
                canCreate: authorizationService.hasPermission(PERMISSION_ENTITY.USER, PERMISSION_OPERATOR.POST),
                canDelete: authorizationService.hasPermission(PERMISSION_ENTITY.USER, PERMISSION_OPERATOR.DELETE),
                canModify: authorizationService.hasPermission(PERMISSION_ENTITY.USER, PERMISSION_OPERATOR.MODIFY)
            }
        }
    )

    getManagedUserVMs = createSelector(
        [() => userService.getSearchUsers(), () => userService.getCurrentUser()],
        (items, currentUser) => {
            let itemVMs: Record<string, UserInfoVM> = {};

            const { id:currentUserId} = currentUser || {};

            forEach(items, (item: UserInfo) => {

                const { id, dod_id, first_name, last_name, email_address, phone_number, department,
                    account_status, role, approved_by, date_approved, isUpdating} = item;

                let registration_status: RegistrationStatusType = RegistrationStatusType.NONE;

                switch (account_status) {
                    case AuthenticationStatus.ACTIVE:
                        registration_status = RegistrationStatusType.ACTIVE;
                        break;
                    case AuthenticationStatus.CREATED:
                        registration_status = RegistrationStatusType.CREATED;
                        break;
                    case AuthenticationStatus.REJECTED:
                        registration_status = RegistrationStatusType.REJECTED;
                        break;
                    default:
                        break;
                }

                let itemVM:UserInfoVM = {
                    id,
                    dod_id: dod_id,
                    first_name,
                    last_name,
                    email_address,
                    phone_number,
                    department,
                    account_status: registration_status,
                    role,
                    approved_by: approved_by ? approved_by : "",
                    date_approved: date_approved ? date_approved : "",
                    isUpdating,
                };

                if (currentUserId) {
                    if (id !== currentUserId) {
                        itemVMs[id] = itemVM;
                    }
                } else {
                    itemVMs[id] = itemVM;
                }
            });
            return Object.values(itemVMs);
        }
    )

    getCurrentUserVM = createSelector(
        [() => userService.getCurrentUser()],
        (currentUser) => {
            const { id="", dod_id='', first_name="", last_name="", email_address="", phone_number="", department="",
                account_status="", role="", approved_by="", date_approved="", isUpdating} = currentUser || {};

            let registration_status: RegistrationStatusType = RegistrationStatusType.NONE;

            switch (account_status) {
                case AuthenticationStatus.ACTIVE:
                    registration_status = RegistrationStatusType.ACTIVE;
                    break;
                case AuthenticationStatus.CREATED:
                    registration_status = RegistrationStatusType.CREATED;
                    break;
                case AuthenticationStatus.REJECTED:
                    registration_status = RegistrationStatusType.REJECTED;
                    break;
                default:
                    break;
            }

            let itemVM: UserInfoVM = {
                id,
                dod_id: dod_id,
                first_name,
                last_name,
                email_address,
                phone_number,
                department,
                account_status: registration_status,
                role,
                approved_by: approved_by ? approved_by : "",
                date_approved: date_approved ? date_approved : "",
                isUpdating,
            };

            return itemVM;
        }
    )

    getRolesVMs = createSelector(
        [() => referenceService.getAllReferences(ReferenceType.ROLE)],
        (roles) => {
            let itemVMs: Record<string, RoleVM> = {};

            forEachKVP(roles, (itemKey: string, itemValue: RoleVM) => {
                itemVMs[itemKey] = {
                    ...itemValue
                };
            })

            return itemVMs;
        }
    )

    getDepartmentVMs = createSelector(
        [() => referenceService.getAllReferences(ReferenceType.DEPARTMENT)],
        (departments) => {
            let itemVMs: Record<string, DepartmentVM> = {};

            forEachKVP(departments, (itemKey: string, itemValue: DepartmentVM) => {
                itemVMs[itemKey] = {
                    ...itemValue
                };
            })

            return itemVMs;
        }
    )

    getUserRequestVMs = createSelector(
        [() => userService.getPendingUsers()],
        (items) => {
            let itemVMs: Record<string, UserInfoVM> = {};

            forEach(items, (item: UserInfo) => {

                const { id, dod_id, first_name, last_name, email_address, phone_number, department,
                    account_status, role, approved_by, date_approved, isUpdating, registration_reason} = item;

                let registration_status: RegistrationStatusType = RegistrationStatusType.NONE;

                switch (account_status) {
                    case AuthenticationStatus.ACTIVE:
                        registration_status = RegistrationStatusType.ACTIVE;
                        break;
                    case AuthenticationStatus.CREATED:
                        registration_status = RegistrationStatusType.CREATED;
                        break;
                    case AuthenticationStatus.REJECTED:
                        registration_status = RegistrationStatusType.REJECTED;
                        break;
                    default:
                        break;
                }

                let itemVM:UserInfoVM = {
                    id,
                    dod_id: dod_id,
                    first_name,
                    last_name,
                    email_address,
                    phone_number,
                    department,
                    account_status: registration_status,
                    role,
                    approved_by: approved_by ? approved_by : "",
                    date_approved: date_approved ? date_approved : "",
                    isUpdating,
                    registration_reason,
                };

                itemVMs[id] = itemVM;
            });
            return Object.values(itemVMs);
        }
    )
}

export const {
    connectedPresenter: ProfilePanelPresenter,
    componentId: ProfilePanelId
} = createComponentWrapper(ProfilePanel);
