import React, {Component} from "react";
import PocketsPanelView from "../views/pocketsPanelView";
import {
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
        }

        bindInstanceMethods(this);
    }

    _getCellContentRenderer(node: PocketNodeVM): JSX.Element {
        const { searchText } = this.props;
        const { editPocketId, selectedNode } = this.state;
        const { id, path, title, pocket_id, isUpdating, resource_id, selected } = node;

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
        const { onPocketItemSelected, onReportItemSelected, onDocumentItemSelected } = this.props;

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
                    if (onDocumentItemSelected) {
                        onDocumentItemSelected(nodeVM.id);
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
        const { onReportItemSelected, onPocketItemToggle, onDocumentItemSelected } = this.props;

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
                        if (onDocumentItemSelected) {
                            onDocumentItemSelected(nodeVM.id);
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

    _onAddExcerptToReport(event: React.DragEvent<HTMLDivElement>, id: string, resource_id: string) {
        const { onAddExcerptToReport } = this.props;

        if (onAddExcerptToReport) {
            onAddExcerptToReport(event, id, resource_id);
        }
    }

    _onDeletePocket(id: string) {
        const { onDelete } = this.props;

        if (onDelete) {
            onDelete(id);
        }
    }

    _onCreateReport(id: string) {
        const { onCreateReport } = this.props;

        if (onCreateReport) {
            onCreateReport(id);
        }
    }

    _onDownloadDocument(id: string) {
        const { onDownloadDocument } = this.props;

        if (onDownloadDocument) {
            onDownloadDocument(id)
        }
    }

    _onRemoveResource(id: string, pocket_id: string) {
        const { onRemoveResource } = this.props;

        if (onRemoveResource) {
            onRemoveResource(id, pocket_id);
        }
    }

    _onRemoveExcerpt(id: string, pocket_id: string) {
        const { onRemoveExcerpt } = this.props;

        if (onRemoveExcerpt) {
            onRemoveExcerpt(id, pocket_id);
        }
    }

    _onRemoveNote(id: string, pocket_id: string) {
        const { onRemoveNote } = this.props;

        if (onRemoveNote) {
            onRemoveNote(id, pocket_id);
        }
    }

    _onRemoveReport(id: string, pocket_id: string) {
        const { onRemoveReport } = this.props;

        if (onRemoveReport) {
            onRemoveReport(id, pocket_id);
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

    _onAddNote() {
        const { onAddNote } = this.props;

        if (onAddNote) {
            onAddNote();
        }
    }

    render() {
        const {
            className="",
            data,
            selectionPath,
            expandedPaths,
        } = this.props;

        const { selectedNode } = this.state;

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
                onCreateReport={this._onCreatePocket}
                onEditPocket={this._onEditPocket}
                onDeletePocket={this._onDeletePocket}
                onDownloadDocument={this._onDownloadDocument}
                onRemoveResource={this._onRemoveResource}
                onRemoveExcerpt={this._onRemoveExcerpt}
                onRemoveNote={this._onRemoveNote}
                onAddNote={this._onAddNote}
                onRemoveReport={this._onRemoveReport}
            />
        );
    }
}
