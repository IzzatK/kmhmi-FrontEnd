import React, {Component} from "react";
import PocketsPanelView from "../views/pocketsPanelView";
import {
    NoteUpdateParams,
    NoteVM,
    PocketNodeVM,
    PocketsPanelPresenterProps,
    PocketsPanelPresenterState,
    PocketUpdateParams
} from "../pocketsPanelModel";
import {bindInstanceMethods} from "../../../../framework.core/extras/utils/typeUtils";
import {PocketNodeType} from "../../../model/pocketNodeType";
import {PocketNodeRenderer} from "../views/renderers/pocketNodeRenderer";
import {ResourceNodeRenderer} from "../views/renderers/resourceNodeRenderer";
import {ExcerptNodeRenderer} from "../views/renderers/excerptNodeRenderer";
import {NoteNodeRenderer} from "../views/renderers/noteNodeRenderer";
import {ReportNodeRenderer} from "../views/renderers/reportNodeRenderer";

export class PocketsPanelPresenter extends Component<PocketsPanelPresenterProps, PocketsPanelPresenterState> {
    constructor(props: any, context: any) {
        super(props, context);

        this.state = {
            selectedNode: undefined,
            editPocketId: "",
            editNoteId: "",
            showPopup: false,
        }

        bindInstanceMethods(this);
    }

    _getCellContentRenderer(node: PocketNodeVM): JSX.Element {
        const { searchText } = this.props;
        const { editPocketId, selectedNode, editNoteId } = this.state;
        const { id, path, title, pocket_id, isUpdating, resource_id, excerpt_id, selected } = node;

        let selectedId = "";
        if (selectedNode) {
            selectedId = selectedNode.id;
        }

        let renderer: JSX.Element;

        switch (node.type) {
            case PocketNodeType.POCKET:
            {
                renderer = (
                    <PocketNodeRenderer
                        id={id}
                        path={path}
                        title={title}
                        onShare={this._onSharePocket}
                        onDownload={this._onDownloadPocket}
                        onSave={this._onSavePocket}
                        searchText={searchText}
                        onSearch={this._onSearch}
                        onSearchTextChanged={this._onSearchTextChanged}
                        onDelete={() => this._onDeletePocket(id)}
                        isUpdating={isUpdating}
                        onCreateReport={() => this._onCreateReport(id)}
                        isEdit={id === editPocketId}
                        selected={id === selectedId}
                        pocket_id={pocket_id}
                        resource_id={resource_id}
                        excerpt_id={excerpt_id}
                    />
                )
                break;
            }
            case PocketNodeType.DOCUMENT:
                renderer = (
                    <ResourceNodeRenderer
                        id={id}
                        path={path}
                        title={title}
                        onDownload={this._onDownloadDocument}
                        onRemove={(id: string) => this._onRemoveResource(id, pocket_id)}
                        isUpdating={isUpdating}
                        selected={id === selectedId}
                        pocket_id={pocket_id}
                        resource_id={resource_id}
                        excerpt_id={excerpt_id}
                    />
                )
                break;
            case PocketNodeType.EXCERPT:
                renderer = (
                    <ExcerptNodeRenderer
                        id={id}
                        path={path}
                        title={title}
                        onRemove={(id: string) => this._onRemoveExcerpt(id, pocket_id)}
                        isUpdating={isUpdating}
                        onAddExcerptToReport={(event: React.DragEvent<HTMLDivElement>, id: string) => this._onAddExcerptToReport(event, id, resource_id || "")}
                        selected={id === selectedId}
                        pocket_id={pocket_id}
                        resource_id={resource_id}
                        excerpt_id={excerpt_id}
                    />
                )
                break;
            case PocketNodeType.NOTE:
                renderer = (
                    <NoteNodeRenderer
                        id={id}
                        path={path}
                        title={title}
                        onRemove={(id: string) => this._onRemoveNote(id, pocket_id)}
                        isUpdating={isUpdating}
                        selected={id === selectedId}
                        isEdit={id === editNoteId}
                        onSave={this._onSaveNote}
                        pocket_id={pocket_id}
                        resource_id={resource_id}
                        excerpt_id={excerpt_id}
                    />
                )
                break;
            case PocketNodeType.REPORT:
                renderer = (
                    <ReportNodeRenderer
                        id={id}
                        path={path}
                        title={title}
                        onDownload={this._onDownloadReport}
                        onRemove={(id: string) => this._onRemoveReport(id, pocket_id)}
                        selected={id === selectedId}
                        pocket_id={pocket_id}
                    />
                )
                break;
            default:
                renderer = (
                    <div className={'display-1, text-secondary'}>UNDEFINED CELL RENDERER</div>
                )
                break;
        }

        return renderer;
    }

    _onNodeSelected(nodeVM: any) {
        //right now this method doesn't do anything
        const { onPocketItemSelected, onReportItemSelected, onResourceItemSelected } = this.props;

        if (onPocketItemSelected) {
            onPocketItemSelected(nodeVM?.path || '');
        }

        if (nodeVM) {
            if (nodeVM.type) {
                if (nodeVM.type === PocketNodeType.REPORT) {
                    if (onReportItemSelected) {
                        onReportItemSelected(nodeVM.id);
                    }
                } else if (nodeVM.type === PocketNodeType.DOCUMENT) {
                    if (onResourceItemSelected) {
                        onResourceItemSelected(nodeVM.id);
                    }
                }
            }
        }
    }

    _setSelectedNode(selectedNode: any) {
        this.setState({
            ...this.state,
            selectedNode
        })
    }

    _onNodeToggle(nodeVM: any, expanded: boolean) {
        const { onReportItemSelected, onPocketItemToggle, onResourceItemSelected } = this.props;

        console.log("expanded=" + expanded)

        if (nodeVM) {
            if (nodeVM.type) {
                if (nodeVM.type === PocketNodeType.REPORT) {
                    if (onReportItemSelected) {
                        onReportItemSelected(nodeVM.id);
                    }
                } else {
                    if (onPocketItemToggle != null) {
                        onPocketItemToggle(nodeVM.path, expanded, nodeVM.type);
                    }

                    if (nodeVM.type === PocketNodeType.DOCUMENT) {
                        if (onResourceItemSelected) {
                            onResourceItemSelected(nodeVM.source_id);
                        }
                    }
                }
            } else {
                if (onPocketItemToggle != null) {
                    onPocketItemToggle(nodeVM.path, expanded);
                }
            }

            this._setSelectedNode(expanded ? nodeVM : "");
        }
    }

    _onEditPocket(id: string) {
        this.setState({
            ...this.state,
            editPocketId: id,
        })
    }

    _onEditNote(id: string) {
        this.setState({
            ...this.state,
            editNoteId: id,
        })
    }

    _onSharePocket(id: string) {
        //open share ui
    }

    _onDownloadPocket(id: string) {
        const { onDownloadPocket } = this.props;

        if (onDownloadPocket) {
            onDownloadPocket(id);
        }
    }

    _onSavePocket(edits: PocketUpdateParams) {
        const { onUpdatePocket } = this.props;

        if (onUpdatePocket) {
            onUpdatePocket(edits);
        }

        this._onEditPocket("");
    }

    _onSaveNote(noteVM: NoteVM) {
        const { onAddNote } = this.props;

        if (onAddNote) {
            onAddNote(noteVM);
        }

        this._onEditNote("");
    }

    _onAddExcerptToReport(event: React.DragEvent<HTMLDivElement>, id: string, resource_id: string) {
        const { onAddExcerptToReport } = this.props;

        if (onAddExcerptToReport) {
            onAddExcerptToReport(event, id, resource_id);
        }
    }

    _onDeletePocket(id: string) {
        const { onDeletePocket } = this.props;

        if (onDeletePocket) {
            onDeletePocket(id);
        }
    }

    _onCreateReport(id: string) {
        const { onCreateReport } = this.props;

        if (onCreateReport) {
            onCreateReport(id);
        }
    }

    _onDownloadDocument(id: string) {
        const { onDownloadResource } = this.props;

        if (onDownloadResource) {
            onDownloadResource(id)
        }
    }

    _onRemoveResource(id: string, pocket_id: string) {
        const { onDeleteResource } = this.props;

        if (onDeleteResource) {
            onDeleteResource(id, pocket_id);
        }
    }

    _onRemoveExcerpt(id: string, pocket_id: string) {
        const { onDeleteExcerpt } = this.props;

        if (onDeleteExcerpt) {
            onDeleteExcerpt(id, pocket_id);
        }
    }

    _onRemoveNote(note_id: string, pocket_id: string, resource_id?: string, excerpt_id?: string) {
        const { onDeleteNoteFromExcerpt, onDeleteNoteFromResource, onDeleteNoteFromPocket } = this.props;

        if (excerpt_id) {
            if (onDeleteNoteFromExcerpt) {
                onDeleteNoteFromExcerpt(note_id, pocket_id);
            }
        } else if (resource_id) {
            if (onDeleteNoteFromResource) {
                onDeleteNoteFromResource(note_id, pocket_id);
            }
        } else {
            if (onDeleteNoteFromPocket) {
                onDeleteNoteFromPocket(note_id, pocket_id);
            }
        }
    }

    _onRemoveReport(id: string, pocket_id: string) {
        const { onDeleteReport } = this.props;

        if (onDeleteReport) {
            onDeleteReport(id, pocket_id);
        }
    }

    _onDownloadReport(id: string) {

    }


    _onCreatePocket() {
        const { onCreatePocket } = this.props;

        if (onCreatePocket) {
            onCreatePocket('New Pocket')
        }
    }

    _onSearch() {
        const { onSearch } = this.props;

        if (onSearch) {
            onSearch();
        }
    }

    _onSearchTextChanged(value: string) {
        const { onSearchTextChanged } = this.props;

        if (onSearchTextChanged) {
            onSearchTextChanged(value);
        }
    }

    _onAddNote(pocket_id: string, resource_id?: string, excerpt_id?: string) {
        const { onAddNote } = this.props;

        let noteVM: NoteVM = {
            id: "null",
            text: "New Note",
            content: "New Note",
            excerpt_id,
            resource_id,
            pocket_id
        }

        if (onAddNote) {
            onAddNote(noteVM);
        }
    }

    _setShowPopup(showPopup: boolean) {
        this.setState({
            ...this.state,
            showPopup
        })
    }

    _onDelete() {
        const { selectedNode } = this.state;

        if (selectedNode) {
            const { type } = selectedNode;

            switch (type) {
                case "POCKET":
                    this._onDeletePocket(selectedNode.id)
                    break;
                case "DOCUMENT":
                    this._onRemoveResource(selectedNode.id, selectedNode.pocket_id)
                    break;
                case "EXCERPT":
                    this._onRemoveExcerpt(selectedNode.id, selectedNode.pocket_id)
                    break;
                case "NOTE":
                    this._onRemoveNote(selectedNode.id, selectedNode.pocket_id, selectedNode.resource_id, selectedNode.excerpt_id)
                    break;
                case "REPORT":
                    this._onRemoveReport(selectedNode.id, selectedNode.pocket_id)
                    break;
                default:
                    break;
            }
        }

        this._setShowPopup(false);
    }

    render() {
        const {
            className="",
            data,
            selectionPath,
            expandedPaths,
        } = this.props;

        const { selectedNode, showPopup } = this.state;

        return (
            <PocketsPanelView
                className={className}
                data={data}
                selectionPath={selectionPath}
                expandedPaths={expandedPaths}
                selectedNode={selectedNode}
                onCreatePocket={this._onCreatePocket}
                cellContentRenderer={this._getCellContentRenderer}
                onNodeToggle={this._onNodeToggle}
                onNodeSelected={this._onNodeSelected}
                onCreateReport={this._onCreateReport}
                onEditPocket={this._onEditPocket}
                onDownloadResource={this._onDownloadDocument}
                onAddNoteToExcerpt={this._onAddNote}
                onAddNoteToPocket={this._onAddNote}
                onAddNoteToResource={this._onAddNote}
                onEditNote={this._onEditNote}
                showPopup={showPopup}
                setShowPopup={this._setShowPopup}
                onDelete={this._onDelete}
            />
        );
    }
}
