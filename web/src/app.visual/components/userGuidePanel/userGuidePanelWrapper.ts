import {createVisualConnector, VisualWrapper} from "../../../framework.visual";
import {UserGuideInfoVM, UserGuidePanelDispatchProps, UserGuidePanelStateProps} from "./userGuidePanelModel";
import {authenticationService, userGuideService} from "../../../serviceComposition";
import UserGuidePanelPresenter from "./presenters/userGuidePanelPresenter";

class _UserGuidePanelWrapper extends VisualWrapper {
    constructor() {
        super();

        this.id = 'app.visual/components/userGuidePanel';

        this.view = UserGuidePanelPresenter;

        this.displayOptions = {
            containerId: 'document-preview-panel',
            visible: false,
            appearClass: 'fadeIn',
            enterClass: 'fadeIn',
        };

        this.mapStateToProps = (state: any, props: any): UserGuidePanelStateProps => {
            return {
                helpDocument: this.getHelpDocument(),
                userProfile: authenticationService.getUserProfile(),
                token: authenticationService.getToken(),
            };
        };

        this.mapDispatchToProps = (dispatch: any): UserGuidePanelDispatchProps => {
            return {

            };
        };

        userGuideService.fetchUserGuide();
    }

    getHelpDocument = () => {
        let userGuide = userGuideService.getUserGuide();
        let userGuideVM: UserGuideInfoVM = {
            preview_url: userGuide?.preview_url
        }
        return userGuideVM;
    };
}

export const {
    connectedPresenter: UserGuidePanelWrapper,
    componentId: UserGuidePanelId
} = createVisualConnector(_UserGuidePanelWrapper);