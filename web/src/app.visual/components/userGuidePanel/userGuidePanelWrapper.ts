import {createVisualConnector, VisualWrapper} from "../../../framework.visual";
import UserGuidePanelView from "./views/userGuidePanelView";
import {UserGuidePanelDispatchProps, UserGuidePanelStateProps} from "./userGuidePanelModel";

class _UserGuidePanelWrapper extends VisualWrapper {
    constructor() {
        super();

        this.id = 'app.visual/components/userGuidePanel';

        this.view = UserGuidePanelView;

        this.displayOptions = {
            containerId: 'system-tool-panel',
            visible: false,
            appearClass: 'fadeIn',
            enterClass: 'fadeIn',
        };

        this.mapStateToProps = (state: any, props: any): UserGuidePanelStateProps => {
            return {

            };
        };

        this.mapDispatchToProps = (dispatch: any): UserGuidePanelDispatchProps => {
            return {

            };
        };
    }
}

export const {
    connectedPresenter: UserGuidePanelWrapper,
    componentId: UserGuidePanelId
} = createVisualConnector(_UserGuidePanelWrapper);