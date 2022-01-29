import StatsPanelView from "./statsPanelView";
import {Presenter} from "../../../../framework.visual/extras/presenter";
import {createComponentWrapper} from "../../../../framework/wrappers/componentWrapper";

class StatsPanel extends Presenter {
    constructor() {
        super();

        this.id ='components/statsPanel';

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
} = createComponentWrapper(StatsPanel);
