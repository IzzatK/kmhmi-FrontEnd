import React, {Component, ElementType, ReactElement} from 'react';
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
import {TreeNodeVM} from "../../theme/widgets/treeView/treeViewModel";
import {PocketNodeType} from "../../model/pocketNodeType";

class PocketsPanelView extends Component<PocketsPanelProps> {
    constructor(props: any, context: any) {
        super(props, context);

        bindInstanceMethods(this);
    }

    getCellContentRenderer(node: PocketNodeVM): JSX.Element {
        const { searchText } = this.props;
        const { id, path, title } = node;

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
                    />
                )
                break;
            }
            case PocketNodeType.DOCUMENT:
                renderer = (
                    <ResourceNodeRenderer id={id} path={path} title={title}
                                          onDownload={this._onDownloadDocument} onRemove={this._onRemoveResource}/>
                )
                break;
            case PocketNodeType.EXCERPT:
                renderer = (
                    <ExcerptNodeRenderer id={id} path={path} title={title} onRemove={this._onRemoveExcerpt} />
                )
                break;
            case PocketNodeType.NOTE:
                renderer = (
                    <NoteNodeRenderer id={id} path={path} title={title} onRemove={this._onRemoveNote}/>
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

    private _onNodeSelected(nodeVM: TreeNodeVM) {
        if (this.props.onPocketItemSelected != null) {
            this.props.onPocketItemSelected(nodeVM?.path || '');
        }
    }

    private _onNodeToggle(nodeVM: TreeNodeVM, expanded: boolean) {
        if (this.props.onPocketItemToggle != null) {
            this.props.onPocketItemToggle(nodeVM.path, expanded);
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
        if (this.props.onUpdatePocket != null) {
            this.props.onUpdatePocket(edits);
        }
        //opens settings ui
    }

    _onDownloadDocument(id: string) {
        const { onDownloadDocument } = this.props;

        if (onDownloadDocument) {
            onDownloadDocument(id)
        }
    }

    _onRemoveResource(id: string) {
        const { onRemoveResource } = this.props;

        if (onRemoveResource) {
            onRemoveResource(id);
        }
    }

    _onRemoveExcerpt(id: string) {
        const { onRemoveExcerpt } = this.props;

        if (onRemoveExcerpt) {
            onRemoveExcerpt(id);
        }
    }

    _onRemoveNote(id: string) {
        const { onRemoveNote } = this.props;

        if (onRemoveNote) {
            onRemoveNote(id);
        }
    }

    onCreatePocket() {
        if (this.props.onCreatePocket != null) {
            this.props.onCreatePocket('Sample')
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
                    <div className={'header-1 title py-3'}>POCKETS MANAGER</div>

                    <div className={"d-flex justify-content-between px-3"}>
                        <Button text={"Sort"}/>
                        <Button text={"Create Pocket"} onClick={this.onCreatePocket}/>
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
