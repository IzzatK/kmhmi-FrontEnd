import StatsPanelView from "./statsPanelView";
import {VisualWrapper} from "../../../framework.visual/extras/visualWrapper";
import {createVisualConnector} from "../../../framework.visual/connectors/visualConnector";

class StatsPanel extends VisualWrapper {
    constructor() {
        super();

        this.id ='app.visual/components/statsPanel';

        this.view = StatsPanelView;

        this.displayOptions = {
            containerId: 'system-tool-panel',
            visible: false,
            appearClass: 'fadeIn',
            enterClass: 'fadeIn',
        };

        this.mapStateToProps = (state: any, props: any) => {
            return {

            }
        }

        this.mapDispatchToProps = (dispatch: any) => {
            return {
            };
        }
    }
}

export const {
    connectedPresenter: StatsPanelPresenter,
    componentId: StatsPanelId
} = createVisualConnector(StatsPanel);
