import React, {Component, ReactElement} from 'react';
import './pocketsPanel.css';
import '../../../theme/stylesheets/panel.css';
import ScrollBar from "../../../theme/widgets/scrollBar/scrollBar";
import TreeView from "../../../theme/widgets/treeView/treeView";
import {bindInstanceMethods, Nullable} from "../../../../framework.core/extras/typeUtils";
import Button from "../../../theme/widgets/button/button";
import {PocketsPanelProps} from "./pocketsPanelModel";
import {PocketNodeType, PocketNodeVM} from "../../../model/pocketUtils";
import {PocketNodeRenderer} from "./renderers/pocketNodeRenderer";
import {ExcerptNodeRenderer} from "./renderers/excerptNodeRenderer";
import {NoteNodeRenderer} from "./renderers/noteNodeRenderer";
import {ResourceNodeRenderer} from "./renderers/resourceNodeRenderer";

class PocketsPanelView extends Component<PocketsPanelProps> {
    constructor(props: any, context: any) {
        super(props, context);

        bindInstanceMethods(this);
    }

    getCellContentRenderer(node: PocketNodeVM) {
        const { id, path, title } = node;

        let renderer: Nullable<ReactElement> = null;

        switch (node.type) {
            case PocketNodeType.POCKET:
            {
                renderer = (
                    <PocketNodeRenderer id={id} path={path} title={title} onSelect={this.onSelect}
                                        onShare={this._onSharePocket} onDownload={this._onDownloadPocket} onSettings={this._onToggleSettings} />
                )
                break;
            }
            case PocketNodeType.DOCUMENT:
                renderer = (
                    <ResourceNodeRenderer id={id} path={path} title={title} onSelect={this.onSelect}
                                          onDownload={this._onDownloadDocument} onRemove={this._onRemoveDocument}/>
                )
                break;
            case PocketNodeType.EXCERPT:
                renderer = (
                    <ExcerptNodeRenderer id={id} path={path} title={title} onSelect={this.onSelect}/>
                )
                break;
            case PocketNodeType.NOTE:
                renderer = (
                    <NoteNodeRenderer id={id} path={path} title={title} onSelect={this.onSelect}/>
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

    onSelect(path: string, selected?: boolean) {
        if (selected) {
            this.props.addSelectionPath(path);
        }
        else {
            this.props.removeSelectionPath(path);
        }
    }

    onCreatePocket() {
        if (this.props.onCreatePocket != null) {
            this.props.onCreatePocket('Sample')
        }
    }

    render() {
        const { className, data, selectionPaths } = this.props;

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
                            <TreeView selectionPaths={selectionPaths} data={data} cellContentRenderer={this.getCellContentRenderer}/>
                        </ScrollBar>
                    </div>
                </div>
            </div>
        );
    }
}

export default PocketsPanelView;
