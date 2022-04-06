import React, {Component} from 'react';
import './pocketsPanel.css';
import '../../theme/stylesheets/panel.css';
import ScrollBar from "../../theme/widgets/scrollBar/scrollBar";
import TreeView from "../../theme/widgets/treeView/treeView";
import {bindInstanceMethods} from "../../../framework.core/extras/utils/typeUtils";
import Button from "../../theme/widgets/button/button";
import {PocketNodeVM, PocketsPanelProps, PocketUpdateParams} from "./pocketsPanelModel";
import {PocketNodeRenderer} from "./renderers/pocketNodeRenderer";
import {ExcerptNodeRenderer} from "./renderers/excerptNodeRenderer";
import {NoteNodeRenderer} from "./renderers/noteNodeRenderer";
import {ResourceNodeRenderer} from "./renderers/resourceNodeRenderer";
import {PocketNodeType} from "../../model/pocketNodeType";
import {PlusSVG} from "../../theme/svgs/plusSVG";
import {ReportNodeRenderer} from "./renderers/reportNodeRenderer";

class PocketsPanelView extends Component<PocketsPanelProps> {
    constructor(props: any, context: any) {
        super(props, context);

        bindInstanceMethods(this);
    }

    getCellContentRenderer(node: PocketNodeVM): JSX.Element {
        const { searchText } = this.props;
        const { id, path, title, pocket_id, isUpdating } = node;

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
                        onDelete={() => this._deletePocket(id)}
                        isUpdating={isUpdating}
                        onCreateReport={() => this._onCreateReport(id)}
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
                        onRemove={this._onRemoveReport}
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

    private _onNodeSelected(nodeVM: any) {
        if (this.props.onPocketItemSelected != null) {
            this.props.onPocketItemSelected(nodeVM?.path || '');
        }

        if (nodeVM) {
            if (nodeVM.type) {
                if (nodeVM.type === PocketNodeType.REPORT) {
                    if (this.props.onReportItemSelected) {
                        this.props.onReportItemSelected(nodeVM.id);
                    }
                }
            }
        }
    }

    private _onNodeToggle(nodeVM: any, expanded: boolean) {
        if (nodeVM) {
            if (nodeVM.type) {
                if (nodeVM.type === PocketNodeType.REPORT) {
                    if (this.props.onReportItemSelected) {
                        this.props.onReportItemSelected(nodeVM.id);
                    }
                } else {
                    if (this.props.onPocketItemToggle != null) {
                        this.props.onPocketItemToggle(nodeVM.path, expanded);
                    }
                }
            } else {
                if (this.props.onPocketItemToggle != null) {
                    this.props.onPocketItemToggle(nodeVM.path, expanded);
                }
            }
        }
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
    }

    private _deletePocket(id: string) {
        const { onDelete } = this.props;

        if (onDelete) {
            onDelete(id);
        }
    }

    private _onCreateReport(id: string) {
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

    _onRemoveReport(id: string) {
        const { onRemoveReport } = this.props;

        if (onRemoveReport) {
            onRemoveReport(id);
        }
    }

    _onDownloadReport(id: string) {

    }

    _onCreatePocket() {
        if (this.props.onCreatePocket != null) {
            this.props.onCreatePocket('New Pocket')
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

    render() {
        const { className, data, selectionPath, expandedPaths } = this.props;

        let cn = "d-flex position-absolute w-100 h-100 align-items-center justify-content-center";

        if (className) {
            cn += ` ${className}`;
        }

        return (
            <div className={cn}>
                <div className={'system-tool-panel pockets-panel flex-fill h-100 p-4 d-flex flex-column'}>
                    <div className={"d-flex justify-content-between px-3"}>
                        <Button className={"bg-transparent"} onClick={this._onCreatePocket}>
                            <div>Create Pocket</div>
                            <PlusSVG className={"nano-image-container"}/>
                        </Button>
                    </div>
                    <div className={'flex-fill'}>
                        <ScrollBar className={'flex-fill'} renderTrackHorizontal={false}>
                            <TreeView selectionPath={selectionPath}
                                      expandedPaths={expandedPaths}
                                      onSelected={this._onNodeSelected}
                                      onToggle={this._onNodeToggle}
                                      rootNodes={data}
                                      showDisclosure={false}
                                      cellContentRenderer={this.getCellContentRenderer}/>
                        </ScrollBar>
                    </div>
                </div>
            </div>
        );
    }
}

export default PocketsPanelView;
