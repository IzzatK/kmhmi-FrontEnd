import {VisualWrapper} from "../../../framework.visual";
import {createVisualConnector} from "../../../framework.visual";
import {CitationType, ReportInfo} from "../../../app.model";
import {displayService, documentService, reportService, selectionService} from "../../../serviceComposition";
import ReportPanelPresenter from "./presenters/reportPanelPresenter";
import {
    ReportInfoVM,
    ReportPanelAppDispatchProps,
    ReportPanelAppStateProps,
    ReportUpdateParams
} from "./reportPanelModel";
import {ReportParamType} from "../../../app.core.api";
import {createSelector} from "@reduxjs/toolkit";
import {DocumentPanelId} from "../documentPanel/documentPanelPresenter";
import {UploadPanelId} from "../uploadPanel/uploadPanelPresenter";

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
            exitClass: '',
        };

        this.mapStateToProps = (state: any): ReportPanelAppStateProps => {
            return {
                report: this._getReport(state),
                citations: {},
                excerpts: {},// this._getExcerpts(state),
            };
        }

        this.mapDispatchToProps = (): ReportPanelAppDispatchProps => {
            return {
                onSaveReport: (edits: any) => this._onSaveReport(edits),
            };
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

    _onSaveReport(edits: ReportUpdateParams) {
        const params: ReportParamType = {
            ...edits
        }

        const { scope } = edits;

        if (scope && scope !== "Draft") {
            reportService.publishReport(params)
                .then(document => {
                    if (document) {
                        const { id } = document;

                        selectionService.setContext("selected-document", id);
                        selectionService.setContext("selected-report", "");
                        displayService.pushNode(DocumentPanelId);
                        displayService.pushNode(UploadPanelId);

                        documentService.fetchDocument(id);

                        const updatedDocument = documentService.getDocument(id);

                        if (!updatedDocument) {
                            setTimeout(() => {
                                documentService.fetchDocument(id);

                                const updatedDocument = documentService.getDocument(id);

                                if (!updatedDocument) {
                                    setTimeout(() => {
                                        documentService.fetchDocument(id);

                                        const updatedDocument = documentService.getDocument(id);

                                        if (!updatedDocument) {
                                            setTimeout(() => {
                                                documentService.fetchDocument(id);
                                            }, 5000);
                                        }
                                    }, 3000);
                                }
                            }, 1000);
                        }
                    }
                })
        } else {
            reportService.updateReport(params);
        }
    }

    _getSelectedReportId = selectionService.makeGetContext("selected-report");

    _getReport = createSelector(
        [(s) => this._getSelectedReportId(s), (s) => reportService.getReports()],
        (reportId, reports: Record<string, ReportInfo>) => {
            let report = reports[reportId];

            let itemVM: ReportInfoVM = {};

            if (report) {
                const {
                    id,
                    author_id,
                    title,
                    publication_date,
                    citation,
                    content,
                    resource_ids,
                    isUpdating,
                    scope
                } = report;

                itemVM = {
                    id,
                    author_id,
                    title,
                    publication_date,
                    content,
                    scope,
                    isUpdating
                }
            }

            return itemVM;
        }
    )
}

export const {
    connectedPresenter: ReportPanelWrapper,
    componentId: ReportPanelId
} = createVisualConnector(_ReportPanelWrapper)
