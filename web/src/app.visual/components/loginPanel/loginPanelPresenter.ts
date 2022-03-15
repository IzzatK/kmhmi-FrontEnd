import {Presenter} from "../../../framework.visual/extras/presenter";
import LoginPanelView from "./loginPanelView";
import {LoginPanelDispatchProps, LoginPanelStateProps, UserInfoVM} from "./loginPanelModel";
import {createComponentWrapper} from "../../../framework.visual/wrappers/componentWrapper";
import {authenticationService, authorizationService} from "../../../serviceComposition";
import {UserInfo} from "../../../app.model";
import {makeGuid} from "../../../framework.core/extras/utils/uniqueIdUtils";

class LoginPanel extends Presenter {
    constructor() {
        super();

        this.id = 'components/LoginPanel';

        this.view = LoginPanelView;

        this.mapStateToProps = (state: any, props: any): LoginPanelStateProps => {
            return {
                dodWarningAccepted: authorizationService.isDodWarningAccepted()
            };
        }

        this.mapDispatchToProps = (): LoginPanelDispatchProps => {
            return {
                onLogin: () =>  {
                    authenticationService.login();
                },
                onRegister: (user: UserInfoVM) => {
                    this.register(user);
                },
                onAgreement: () => {
                    authorizationService.setDodWarningAccepted(true);
                }
            };
        }

        this.displayOptions = {
            containerId: 'bumed',
            visible: true,
            appearClass: 'fadeIn',
            enterClass: 'fadeIn',
            exitClass: 'fadeOut',
        }
    }

    register(userVM: UserInfoVM) {
        let user = new UserInfo(makeGuid());

        user.dod_id = userVM.dod_id || '';
        user.first_name = userVM.first_name || '';
        user.last_name = userVM.last_name || '';
        user.email_address = userVM.email || '';
        user.phone_number = userVM.phone || '';

        authenticationService.register(user);
    }
}

export const {
    connectedPresenter: LoginPanelPresenter,
    componentId: LoginPanelId,
} = createComponentWrapper(LoginPanel)


