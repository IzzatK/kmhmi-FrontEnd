import SystemBannerView from './systemBannerView'
import {Presenter} from "../../../framework.visual/extras/presenter";
import {createComponentWrapper} from "../../../framework/wrappers/componentWrapper";
import {authenticationService, documentService, userService} from "../../../app.core/serviceComposition";
import {UserInfo} from "../../../app.model";
import {makeGuid} from "../../../framework.visual/extras/utils/uniqueIdUtils";

class SystemBanner extends Presenter {
    constructor() {
        super();

        this.id ='components/systemBanner';

        this.view = SystemBannerView;

        this.mapStateToProps = (state: any, props: any) => {
            return {
                userName: this.formatUserName(),
                role: userService.getCurrentUser()?.role,
                isLoggedIn: userService.getCurrentUser() !== null,
            }
        }

        this.mapDispatchToProps = () => {
            return {
                onReturnHome: () => this.onReturnHome(),
                onLogout: () => this.onLogout()
            };
        }
    }

    formatUserName() {
        const {id, first_name, last_name } = userService.getCurrentUser() || new UserInfo(makeGuid());


        let result = id;
        if (first_name !== undefined) {
            result = first_name;
        }

        if (last_name !== undefined) {
            result += ` ${last_name}`;
        }

        return result;
    }

    onLogout() {
        authenticationService.logout();
        documentService.clearDocuments();
    }

    onReturnHome = () => {
        documentService.clearSearch();
    }
}


export const {
    connectedPresenter: SystemBannerPresenter,
    componentId: SystemBannerId
} = createComponentWrapper(SystemBanner);
