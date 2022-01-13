import ProfilePanelView from "./profilePanelView";
import {Presenter} from "../../../../framework.visual/extras/presenter";
import {createComponentWrapper} from "../../../../framework/wrappers/componentWrapper";
import {forEach, forEachKVP} from "../../../../framework.visual/extras/utils/collectionUtils";
import {createSelector} from "@reduxjs/toolkit";
import {ReferenceType, UserInfo} from "../../../../model";
import {authorizationService, referenceService, userService} from "../../../../application/serviceComposition";
import {AccountStatusVM, DepartmentVM, PermissionsVM, RoleVM, UserInfoVM, UserRequestInfoVM} from "./profilePanelModel";
import {PermissionInfo} from "../../../../model/permissionInfo";
import {PERMISSION_ENTITY, PERMISSION_OPERATOR} from "../../../../api";
import {UserRequestInfo} from "../../../../model/userRequestInfo";

class ProfilePanel extends Presenter {
    private readonly accountStatuses: AccountStatusVM[];
    constructor() {
        super();

        this.id ='components/profilePanel';

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
                id: 'Created',
                title: 'Created',
            },
            {
                id: 'Active',
                title: 'Active',
            },
            {
                id: 'Inactive',
                title: 'Inactive',
            },
        ]

        this.mapStateToProps = (state: any, props: any) => {
            return {
                users: this.getManagedUserVMs(state),
                userLookUp: userService.getUsers(),
                currentUser: this.getCurrentUserVM(state),
                roles: this.getRolesVMs(state),
                departments: this.getDepartmentVMs(state),
                accountStatuses: this.accountStatuses,
                permissions: this.getPermissions(state),
                userRequests: this.getUserRequestVMs(state),
            }
        }

        this.mapDispatchToProps = () => {
            return {
                onUserAdded: (user: UserInfoVM) => userService.createUser(user),
                onUserUpdated: (user: UserInfo) => userService.updateUser(user),
                onUserRemoved: (id: string) => userService.removeUser(id),
                onAcceptUserRequest: (id: string) => userService.acceptUserRequest(id),
                onDeclineUserRequest: (id: string) => userService.declineUserRequest(id),
            };
        }
    }

    getPermissions = createSelector<any, string, Record<string, PermissionInfo>, PermissionsVM>(
        [() => userService.getCurrentUserId(), authorizationService.getPermissions],
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
        [userService.getUsers, userService.getCurrentUser],
        (items, currentUser) => {
            let itemVMs: Record<string, UserInfoVM> = {};

            const { id:currentUserId} = currentUser || {};

            forEach(items, (item: UserInfo) => {

                const { id, dod_id, first_name, last_name, email_address, phone_number, department,
                    account_status, role, approved_by, date_approved} = item;

                let itemVM:UserInfoVM = {
                    id,
                    dod_id: dod_id,
                    first_name,
                    last_name,
                    email_address,
                    phone_number,
                    department,
                    account_status,
                    role,
                    approved_by: approved_by ? approved_by : "",
                    date_approved: date_approved ? date_approved : "",
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
        [userService.getCurrentUser],
        (currentUser) => {
            const { id="", dod_id=-1, first_name="", last_name="", email_address="", phone_number="", department="",
                account_status="", role="", approved_by="", date_approved=""} = currentUser || {};

            let itemVM: UserInfoVM = {
                id,
                dod_id: dod_id,
                first_name,
                last_name,
                email_address,
                phone_number,
                department,
                account_status,
                role,
                approved_by: approved_by ? approved_by : "",
                date_approved: date_approved ? date_approved : "",
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
        [userService.getUserRequests],
        (items) => {
            let itemVMs: Record<string, UserRequestInfoVM> = {};

            forEach(items, (item: UserRequestInfo) => {
                const {
                    id,
                    user_id,
                    role,
                    duration,
                    comment
                } = item;

                let name = "";
                let user = userService.getUser(user_id);

                if (user) {
                    name = user.first_name + user.last_name ? " " + user.last_name : "";
                }

                let itemVM: UserRequestInfoVM = {
                    id,
                    name,
                    role,
                    duration,
                    comment
                }

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
