import {VisualWrapper} from "../../../framework.visual/extras/visualWrapper";
import ReportPanelView from "./views/reportPanelView";
import {createVisualConnector} from "../../../framework.visual/connectors/visualConnector";
import {CitationType} from "../../../app.model";
import {selectionService} from "../../../serviceComposition";
import ReportPanelPresenter from "./presenters/reportPanelPresenter";

class _ReportPanelWrapper extends VisualWrapper {
    constructor() {
        super();

        this.id = 'app.visual/components/reportPanel';

        this.view = ReportPanelPresenter;

        this.displayOptions = {
            containerId: 'document-preview-panel',
            visible: false,
            appearClass: 'fadeIn',
            enterClass: 'fadeIn',
            exitClass: 'shrinkHorizontal-active',
        };

        this.mapStateToProps = (state: any) => {
            return {
                report: {},// this._getReport(state),
                citations: () => this._getCitations(),
                excerpts: {},// this._getExcerpts(state),
            };
        }

        this.mapDispatchToProps = () => {
            return {};
        }
    }

    _getCitations() {
        return {
            [CitationType.MLA]: {title: 'MLA'},
            [CitationType.APA]: {title: 'APA'},
            [CitationType.CHICAGO]: {title: 'Chicago'},
            [CitationType.Harvard]: {title: 'Harvard'},
        }
    }

    _getSelectedReportId = selectionService.makeGetContext("selected-report");
}

export const {
    connectedPresenter: ReportPanelWrapper,
    componentId: ReportPanelId
} = createVisualConnector(_ReportPanelWrapper)
