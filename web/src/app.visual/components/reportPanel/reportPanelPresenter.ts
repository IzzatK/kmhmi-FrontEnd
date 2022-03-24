import {VisualWrapper} from "../../../framework.visual/extras/visualWrapper";
import ReportPanelView from "./reportPanelView";
import {createVisualConnector} from "../../../framework.visual/connectors/visualConnector";
import {CitationType} from "../../../app.model";
import {selectionService} from "../../../serviceComposition";

class ReportPanel extends VisualWrapper {
    constructor() {
        super();

        this.id = 'components/reportPanel';

        this.view = ReportPanelView;

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

    // _getReport = createSelector(
    //     [this._getSelectedReportId, pocketService.getReports, documentService.getAllDocuments],
    //     (reportId, reports, documents) => {
    //
    //         let report = reports[reportId];
    //
    //         let itemVM: ReportInfoVM = {};
    //
    //         if (report) {
    //             const { id, pocket_id, author_id, title, date, citation, documentIds } = report;
    //
    //             let displayDate = new Date(date).toLocaleString().split(",")[0];
    //             if (!date || date === "") {
    //                 displayDate = "No Publication Date";
    //             }
    //
    //             let displayCitation: string;
    //
    //             switch (citation) {
    //                 case CitationType.APA:
    //                     displayCitation = "APA";
    //                     break;
    //                 case CitationType.Harvard:
    //                     displayCitation = "Harvard";
    //                     break;
    //                 case CitationType.CHICAGO:
    //                     displayCitation = "Chicago";
    //                     break;
    //                 case CitationType.MLA:
    //                 default:
    //                     displayCitation = "MLA";
    //                     break;
    //             }
    //
    //             let documentItemVMs: Record<string, DocumentVM> = {};
    //
    //             forEachKVP(documents, (item: DocumentInfo) => {
    //                 const { id, title, author, file_name, publication_date, upload_date } = item;
    //
    //                 if (documentIds.has(id)) {
    //                     documentItemVMs[id] = {
    //                         title,
    //                         author,
    //                         file_name,
    //                         publication_date,
    //                         upload_date,
    //                     }
    //                 }
    //             })
    //
    //             itemVM = {
    //                 id: id,
    //                 pocketId: pocket_id,
    //                 authorId: author_id,
    //                 title: title,
    //                 date: displayDate,
    //                 citation: displayCitation,
    //                 documents: documentItemVMs,
    //             }
    //         }
    //
    //         return itemVM;
    //     }
    // );
    //
    // _getExcerpts = createSelector(
    //     [this._getSelectedReportId, pocketService.getReports],
    //     (reportId, reports) => {
    //
    //         let report = reports[reportId];
    //
    //         let itemVMs: Record<string, ExcerptVM> = {};
    //
    //         if (report) {
    //             const { excerptIds } = report;
    //
    //             excerptIds.forEach((item: string) => {
    //                 let excerpt: Nullable<ExcerptInfo> = pocketService.getExcerpt(item);
    //
    //                 if (excerpt) {
    //                     const { id, text, content, location, authorId, noteIds } = excerpt;
    //
    //                     let noteVMs: Record<string, NoteVM> = {};
    //
    //
    //                     //populate noteVMs herer
    //
    //                     itemVMs[id] = {
    //                         text,
    //                         content,
    //                         location,
    //                         authorId,
    //                         notes: noteVMs,
    //                     }
    //                 }
    //
    //             });
    //         }
    //
    //         return itemVMs;
    //     }
    // )
}

export const {
    connectedPresenter: ReportPanelPresenter,
    componentId: ReportPanelId
} = createVisualConnector(ReportPanel)
