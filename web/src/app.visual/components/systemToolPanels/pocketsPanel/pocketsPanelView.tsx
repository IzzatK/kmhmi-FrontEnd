import React, {Component, ElementType, ReactElement} from 'react';
import './pocketsPanel.css';
import '../../../theme/stylesheets/panel.css';
import ScrollBar from "../../../theme/widgets/scrollBar/scrollBar";
import TreeView from "../../../theme/widgets/treeView/treeView";
import {bindInstanceMethods, Nullable} from "../../../../framework.core/extras/utils/typeUtils";
import Button from "../../../theme/widgets/button/button";
import {PocketNodeVM, PocketsPanelProps} from "./pocketsPanelModel";
import {PocketNodeRenderer} from "./renderers/pocketNodeRenderer";
import {ExcerptNodeRenderer} from "./renderers/excerptNodeRenderer";
import {NoteNodeRenderer} from "./renderers/noteNodeRenderer";
import {ResourceNodeRenderer} from "./renderers/resourceNodeRenderer";
import {TreeNodeVM} from "../../../theme/widgets/treeView/treeViewModel";
import {PocketNodeType} from "../../../model/pocketNodeType";

class PocketsPanelView extends Component<PocketsPanelProps> {
    constructor(props: any, context: any) {
        super(props, context);

        bindInstanceMethods(this);
    }

    getCellContentRenderer(node: PocketNodeVM): JSX.Element {
        const { id, path, title } = node;

        let renderer: JSX.Element;

        switch (node.type) {
            case PocketNodeType.POCKET:
            {
                renderer = (
                    <PocketNodeRenderer id={id} path={path} title={title}
                                        onShare={this._onSharePocket} onDownload={this._onDownloadPocket} onSettings={this._onToggleSettings} />
                )
                break;
            }
            case PocketNodeType.DOCUMENT:
                renderer = (
                    <ResourceNodeRenderer id={id} path={path} title={title}
                                          onDownload={this._onDownloadDocument} onRemove={this._onRemoveDocument}/>
                )
                break;
            case PocketNodeType.EXCERPT:
                renderer = (
                    <ExcerptNodeRenderer id={id} path={path} title={title} />
                )
                break;
            case PocketNodeType.NOTE:
                renderer = (
                    <NoteNodeRenderer id={id} path={path} title={title} />
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

    _onToggleSettings(id: string) {

        //opens settings ui
    }

    _onDownloadDocument(id: string) {
        const { onDownloadDocument } = this.props;

        if (onDownloadDocument) {
            onDownloadDocument(id)
        }
    }

    _onRemoveDocument(id: string) {
        const { onRemoveDocument } = this.props;

        if (onRemoveDocument) {
            onRemoveDocument(id);
        }
    }

    onCreatePocket() {
        if (this.props.onCreatePocket != null) {
            this.props.onCreatePocket('Sample')
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
