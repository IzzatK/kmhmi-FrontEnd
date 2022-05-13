import {VisualWrapper} from "../../../framework.visual";
import {createVisualConnector} from "../../../framework.visual";
import {createSelector, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {
    authenticationService,
    displayService,
    documentService,
    pocketService,
    reportService,
    selectionService,
    userService
} from "../../../serviceComposition";
import {forEach} from "../../../framework.core/extras/utils/collectionUtils";
import {ExcerptMapper, NoteInfo, PocketMapper, ResourceMapper} from "../../../app.model";
import {PocketNodeType} from "../../model/pocketNodeType";
import {
    PocketCaseReducers,
    PocketNodeVM,
    PocketSliceState,
    PocketsPanelAppDispatchProps,
    PocketsPanelAppStateProps,
    PocketUpdateParams
} from "./pocketsPanelModel";
import {
    ExcerptParamType,
    NoteParamType,
    PocketParamType,
    ReportParamType,
    ResourceParamType
} from "../../../app.core.api";
import {ReportPanelId} from "../reportPanel/reportPanelWrapper";
import React from "react";
import {PocketsPanelPresenter} from "./presenters/pocketsPanelPresenter";
import {DocumentInfoVM, ObjectType} from "../searchResultsPanel/searchResultsModel";
import {NoteVM} from "../documentPanel/documentPanelModel";

class _PocketsPanelWrapper extends VisualWrapper<PocketSliceState, PocketCaseReducers> {
    constructor() {
        super();

        this.id ='app.visual/components/pocketsPanel';

        this.view = PocketsPanelPresenter;

        this.displayOptions = {
            containerId: 'system-tool-panel',
            visible: false,
            appearClass: 'fadeIn',
            enterClass: 'fadeIn',
        };

        this.model = createSlice({
            name: this.id,
            initialState: {
                expandedPaths: []
            } as PocketSliceState,
            reducers: {
                addExpandedPath: (state: PocketSliceState, action: PayloadAction<string>) => {
                    const expandedPath = action.payload;
                    let matchedPath = '';

                    if (!state.expandedPaths.includes(expandedPath)) {
                        state.expandedPaths.forEach((existingPath:string) => {
                            if (expandedPath.startsWith(existingPath)) {
                                matchedPath = existingPath;
                                return true;
                            }
                            else if (existingPath.startsWith(expandedPath)) {
                                matchedPath = existingPath;
                                return true;
                            }
                        })

                        if (matchedPath) {
                            while (state.expandedPaths.indexOf(matchedPath) !== -1) {
                                const index = state.expandedPaths.indexOf(matchedPath);
                                if (index !== -1) {
                                    state.expandedPaths.splice(index, 1);
                                }
                            }

                        }

                        state.expandedPaths.push(expandedPath);
                    }
                },
                removeExpandedPath: (state:PocketSliceState, action:PayloadAction<string>) => {
                    const expandedPath = action.payload;
                    let matchedPath = '';

                    state.expandedPaths.forEach((existingPath:string) => {
                        // reverse includes from adding
                        if (existingPath.includes(expandedPath)) {
                            matchedPath = existingPath;
                            return true;
                        }
                    })

                    if (matchedPath) {
                        const index = state.expandedPaths.indexOf(matchedPath);
                        if (index !== -1) {
                            state.expandedPaths.splice(index, 1);
                        }
                    }

                    if (expandedPath.includes('/', 1)) {
                        let index = expandedPath.lastIndexOf('/');
                        const shortenedPath = expandedPath.substr(0, index);
                        state.expandedPaths.push(shortenedPath);
                    }
                }
            },
        });

        this.mapStateToProps = (state: any, props: any): PocketsPanelAppStateProps => {
            return {
                data: this.getPocketTree(state),
                selectionPath: this.getSelectedPocketNodePath(state),
                expandedPaths: this.getExpandedPaths(state),
                searchText: userService.getSearchText(),
            }
        }

        this.mapDispatchToProps = (dispatch: any): PocketsPanelAppDispatchProps => {
            return {
                onAddExcerptToReport: (event: React.DragEvent<HTMLDivElement>, id: string, report_id: string) => this._onAddExcerptToReport(event, id, report_id),
                onPocketItemSelected: (id: string) => this.onPocketItemSelected(id),
                onPocketItemToggle: (id: string, expanded: boolean, type: string | undefined) => this.onPocketItemToggle(id, expanded, type),
                onCreatePocket: (title: string) => pocketService.addOrUpdatePocket({title}),
                onDownloadDocument: (id: string) => this._onDownloadDocument(id),
                onDownloadPocket: (id: string) => this._onDownloadPocket(id),
                onUpdatePocket: (edits: PocketUpdateParams) => _PocketsPanelWrapper._onUpdatePocket(edits),
                onRemoveExcerpt: (id: string, pocket_id: string) => this._onRemoveExcerpt(id, pocket_id),
                onRemoveResource: (id: string, pocket_id: string) => this._onRemoveResource(id, pocket_id),
                onRemoveNote: (id: string, pocket_id: string) => this._onRemoveNote(id, pocket_id),
                onSearch: () => userService.fetchUsers(),
                onSearchTextChanged: (value: string) => userService.setSearchText(value),
                onDelete: (id: string) => this._onRemovePocket(id),
                onCreateReport: (id: string) => _PocketsPanelWrapper._onCreateReport(id),
                onRemoveReport: (id: string, pocket_id: string) => this._onRemoveReport(id, pocket_id),
                onReportItemSelected: (id: string) => this._onReportItemSelected(id),
                onDocumentItemSelected: (id: string) => this._onDocumentItemSelected(id),
                onAddNote: () => {}
            };
        }
    }

    private static _onUpdatePocket(edits: PocketUpdateParams) {
        const params: PocketParamType = {
            id: edits.id
        }

        if (edits.title) {
            params.title = edits.title
        }

        void pocketService.addOrUpdatePocket(params)
    }

    private static _onCreateReport(id: string) {
        const params: ReportParamType = {
            title: "New Report",
        }

        reportService.createReport(params)
            .then(report => {
                if (report) {
                    let report_ids: string[] = [];

                    const pocket = pocketService.getPocketInfo(id);
                    if (pocket) {
                        forEach(pocket.report_ids, (report_id: string) => {
                            report_ids.push(report_id);
                        })
                    }

                    report_ids.push(report.id);

                    const pocketParams: PocketParamType = {
                        id,
                        report_ids,
                    }

                    void pocketService.addOrUpdatePocket(pocketParams);
                }
            })
    }

    getSelectedPocketNodePath = selectionService.makeGetContext("selected-pocket-node-path");

    getSelectedPocket = selectionService.makeGetContext("selected-pocket");
    getSelectedDocument = selectionService.makeGetContext("selected-document");
    getSelectedExcerpt = selectionService.makeGetContext("selected-excerpt");
    getSelectedNote = selectionService.makeGetContext("selected-note");
    getSelectedReport = selectionService.makeGetContext("selected-report");

    getPocketNodeVMs = createSelector(
        [
            () => pocketService.getPocketMappers(),
            () => reportService.getReports(),
            (s) => this.getSelectedPocket(s),
            (s) => this.getSelectedDocument(s),
            (s) => this.getSelectedExcerpt(s),
            (s) => this.getSelectedNote(s),
            (s) => this.getSelectedReport(s),
        ],
        (
            pocketMappers,
            reportInfos,
            selectedPocketId,
            selectedDocumentId,
            selectedExcerptId,
            selectedNoteId,
            selectedReportId,
        ) => {
            let nodeVMs: Record<string, PocketNodeVM> = {};

            // debugger;

            forEach(pocketMappers, (pocketMapper: PocketMapper) => {
                const pocket = pocketMapper.pocket;

                // add the pocket
                const pocketPath = `/${pocket.id}`;
                nodeVMs[pocketPath] = {
                    id: pocket.id,
                    type: PocketNodeType.POCKET,
                    path: `/${pocket.id}`,
                    title: pocket.title || '',
                    content: '',
                    childNodes: [],
                    pocket_id: pocket.id,
                    isUpdating: pocket.isUpdating,
                    selected: pocket.id === selectedPocketId,
                }

                forEach(pocketMapper.resourceMappers, (resourceMapper: ResourceMapper) => {
                    const resource = resourceMapper.resource;
                    const resourcePath = `${pocketPath}/${resource.id}`;

                    nodeVMs[resourcePath] = {
                        id: resource.id,
                        type: PocketNodeType.DOCUMENT,
                        path: resourcePath,
                        title: resource.source_title || '',
                        content: '',
                        childNodes: [],
                        pocket_id: pocket.id,
                        isUpdating: pocket.isUpdating,
                        selected: resource.id === selectedDocumentId,
                    }

                    forEach(resourceMapper.excerptMappers, (excerptMapper: ExcerptMapper) => {
                        const excerpt = excerptMapper.excerpt;
                        const excerptPath = `${resourcePath}/${excerpt.id}`;

                        nodeVMs[excerptPath] = {
                            id: excerpt.id,
                            type: PocketNodeType.EXCERPT,
                            path: excerptPath,
                            title: excerpt.text || '',
                            content: '',
                            childNodes: [],
                            pocket_id: pocket.id,
                            isUpdating: pocket.isUpdating,
                            resource_id: resource.id,
                            selected: excerpt.id === selectedExcerptId,
                        }

                        forEach(excerptMapper.notes, (note: NoteInfo) => {
                            const notePath = `${excerptPath}/${note.id}`;

                            nodeVMs[notePath] = {
                                id: note.id,
                                type: PocketNodeType.NOTE,
                                path: notePath,
                                title: note.text,
                                content: '',
                                childNodes: [],
                                pocket_id: pocket.id,
                                isUpdating: pocket.isUpdating,
                                selected: note.id === selectedNoteId,
                            }
                        })

                    })
                });

                forEach(pocket.report_ids, (report_id: string) => {
                    if (reportInfos[report_id]) {
                        const reportInfo = reportInfos[report_id];
                        const reportPath = `/${pocket.id}/${reportInfo.id}`;

                        nodeVMs[reportPath] = {
                            id: reportInfo.id,
                            type: PocketNodeType.REPORT,
                            path: reportPath,
                            title: reportInfo.title,
                            content: '',
                            childNodes: [],
                            pocket_id: pocket.id,
                            isUpdating: reportInfo.isUpdating || false,
                            selected: reportInfo.id === selectedReportId,
                        }
                    }
                })
            });

            return nodeVMs;
        }
    );



    onPocketItemSelected(id: string) {
        selectionService.setContext("selected-pocket-node-path", id);
    }

    _onReportItemSelected(id: string) {
        selectionService.setContext("selected-report", id);
        selectionService.setContext("selected-document", "");
        displayService.pushNode(ReportPanelId);
    }

    _onDocumentItemSelected(id: string) {
        selectionService.setContext("selected-document", id);
        // selectionService.setContext("selected-report", "");
        // displayService.pushNode(DocumentPanelId);
        // documentService.fetchDocument(id);
    }

    onPocketItemToggle(id: string, expanded: boolean, type: string | undefined) {
        if (expanded) {
            this.sendEvent(this.model?.actions.addExpandedPath(id));
            selectionService.setContext("selected-pocket-node-path", id);

            let selectedId = id;

            let selectedIdArray = id.split("/");
            // console.log(expanded)

            if (type) {
                switch (type) {
                    case "POCKET":
                        if (selectedIdArray.length > 1) {
                            selectedId = selectedIdArray[1]
                        }
                        // console.log(expanded ? selectedId : "")
                        selectionService.setContext("selected-pocket", expanded ? selectedId : "");
                        break;
                    case "EXCERPT":
                        // debugger;
                        if (selectedIdArray.length > 3) {
                            selectedId = selectedIdArray[3]
                        }
                        selectionService.setContext("selected-excerpt", expanded ? selectedId : "");
                        break;
                    case "NOTE":
                        if (selectedIdArray.length > 4) {
                            selectedId = selectedIdArray[4]
                        }
                        selectionService.setContext("selected-note", expanded ? selectedId : "");
                        break;
                    default:
                        break;
                }
            }
        }
        else {
            this.sendEvent(this.model?.actions.removeExpandedPath(id));
        }
    }

    getPocketTree = createSelector(
        [(s) => this.getPocketNodeVMs(s)],
        (nodeVMs) => {
            // build the visual data structure, using the hash map
            let dataTreeVM: PocketNodeVM[] = [];

            if (nodeVMs) {
                forEach(nodeVMs, (nodeVM: PocketNodeVM) => {
                    let lastPathIndex = nodeVM.path.lastIndexOf('/');
                    let parentId = nodeVM.path.slice(0, lastPathIndex);

                    if( parentId && parentId.length > 0) {
                        nodeVMs[parentId].childNodes.push(nodeVMs[nodeVM.path])
                    }
                    else {
                        dataTreeVM.push(nodeVMs[nodeVM.path])
                    }
                })
            }

            return dataTreeVM;
        }
    )

    private getExpandedPaths (state: any) {
        return this.getPersistentState(state)?.expandedPaths || [];
    }

    private _onRemoveExcerpt(id: string, pocket_id: string) {
        void pocketService.removeExcerptFromResource(id, pocket_id);
    }

    private _onRemoveNote(id: string, pocket_id: string) {
        void pocketService.removeNoteFromExcerpt(id, pocket_id);
    }

    private _onRemoveResource(id: string, pocket_id: string) {
        void pocketService.removeResourceFromPocket(id, pocket_id);
    }

    private _onRemoveReport(id: string, pocket_id: string) {
        reportService.removeReport(id)
            .then(report_id => {
                const pocket = pocketService.getPocketInfo(pocket_id);

                if (pocket) {
                    let newReportIds: string[] = [];
                    forEach(pocket.report_ids, (report_id: string) => {
                        if (report_id !== id) {
                            newReportIds.push(report_id);
                        }
                    });

                    const params: PocketParamType = {
                        id: pocket_id,
                        report_ids: newReportIds,
                    }

                    pocketService.addOrUpdatePocket(params);
                }
            })
    }

    private _onRemovePocket(pocket_id: string) {
        const pocket = pocketService.getPocketInfo(pocket_id);

        if (pocket) {
            forEach(pocket.report_ids, (report_id: string) => {
                reportService.removeReport(report_id);
            })

            pocketService.removePocket(pocket_id);
        }

    }

    private _onAddExcerptToReport(event: React.DragEvent<HTMLDivElement>, id: string, resource_id: string) {
        const excerpt = pocketService.getExcerpt(id);

        const resource = pocketService.getResource(resource_id);

        if (excerpt) {
            const { text } = excerpt;

            event.dataTransfer.setData("text/plain", "\"" + text + "\"");
            event.dataTransfer.setData("text/excerpt/excerpt_id", id);

            if (resource) {
                const { source_author, title, source_publication_date} = resource;

                let resource_information = "";

                let authors = JSON.parse(source_author);

                if (Array.isArray(authors)) {
                    let index = 0;
                    forEach(JSON.parse(source_author), (author: string) => {
                        if (index < source_author.length - 2) {
                            resource_information += author + ", ";
                        } else {
                            resource_information += author + ". ";
                        }

                        index++;
                    });
                } else {
                    resource_information = authors;
                }

                resource_information += title + ". " + source_publication_date.toLocaleString().split("T")[0]

                event.dataTransfer.setData("text/excerpt", resource_information);
            } else {
                event.dataTransfer.setData("text/excerpt", "resource information");
            }
        }
    }

    private _onDownloadDocument(id: string) {
        const userProfile = authenticationService.getUserProfile();
        const token = authenticationService.getToken();
        const document = documentService.getDocument(id);

        if (userProfile && document) {
            const { username, id, email, firstName, lastName } = userProfile;
            const { original_url } = document;

            let xhr = new XMLHttpRequest;

            xhr.open( "GET", original_url || "");

            xhr.addEventListener( "load", function(){
                window.open(original_url);
            }, false);

            xhr.setRequestHeader("km-token", `bearer ${token}` );
            xhr.setRequestHeader("km-user-name", username );
            xhr.setRequestHeader("km-user-id", id );
            xhr.setRequestHeader("km-email", email );
            xhr.setRequestHeader("km-first-name", firstName );
            xhr.setRequestHeader("km-last-name", lastName );

            xhr.send();
        }
    }

    private _onDownloadPocket(id: string) {

    }

    _onSaveNote(note: NoteVM) {
        const { id, excerpt_id, resource_id, pocket_id, text, content } = note;

        const excerptParams: ExcerptParamType = {
            id: excerpt_id
        };

        let noteParams: NoteParamType;

        if (id !== "null") {
            noteParams = {
                id,
                text,
                content
            }
        } else {
            noteParams = {
                text,
                content
            }
        }

        const resourceParams: ResourceParamType = {
            id: resource_id,
        }

        const pocketParams: PocketParamType = {
            id: pocket_id
        }

        pocketService.addNoteAndExcerptToPocket(noteParams, excerptParams, resourceParams, pocketParams);
    }
}

export const {
    connectedPresenter: PocketsPanelWrapper,
    componentId: PocketsPanelId
} = createVisualConnector(_PocketsPanelWrapper);
