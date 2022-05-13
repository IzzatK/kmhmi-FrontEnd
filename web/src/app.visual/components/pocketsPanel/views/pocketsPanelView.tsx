import React, {Component} from 'react';
import '../pocketsPanel.css';
import {PocketsPanelViewProps, PocketTabType} from "../pocketsPanelModel";
import Button from "../../../theme/widgets/button/button";
import {PlusSVG} from "../../../theme/svgs/plusSVG";
import TreeView from "../../../theme/widgets/treeView/treeView";
import ScrollBar from "../../../theme/widgets/scrollBar/scrollBar";
import {CreateReportSVG} from "../../../theme/svgs/createReportSVG";
import {EditSVG} from "../../../theme/svgs/editSVG";
import {RemoveSVG} from "../../../theme/svgs/removeSVG";
import {DownloadSVG} from "../../../theme/svgs/downloadSVG";
import {TrashSVG} from "../../../theme/svgs/trashSVG";
import {AddNewSVG} from "../../../theme/svgs/addNewSVG";
import {AddNoteSVG} from "../../../theme/svgs/addNoteSVG";

class PocketsPanelView extends Component<PocketsPanelViewProps> {
    render() {
        const {
            className,
            data,
            selectionPath,
            expandedPaths,
            selectedNode,
            onCreatePocket,
            onNodeToggle,
            onNodeSelected,
            cellContentRenderer,
            onCreateReport,
            onEditPocket,
            onDeletePocket,
            onDownloadDocument,
            onRemoveResource,
            onRemoveExcerpt,
            onRemoveNote,
            onAddNote,
            onEditNote,
            onRemoveReport,
        } = this.props;

        let cn = "d-flex position-absolute w-100 h-100 align-items-center justify-content-center";

        if (className) {
            cn += ` ${className}`;
        }

        let optionsDiv: JSX.Element = (<div/>);

        let showOptionsBar = true;

        if (selectedNode) {
            // debugger;
            switch (selectedNode.type) {
                case "POCKET":
                    optionsDiv = (
                        <div className={`action-bar d-flex h-gap-3`}>
                            <Button className={"btn-transparent"} onClick={() => onCreateReport(selectedNode.id, selectedNode.pocket_id)} tooltip={"Create Report"}>
                                <CreateReportSVG className={"small-image-container"}/>
                            </Button>
                            <Button className={"btn-transparent"} onClick={() => onEditPocket(selectedNode.id)} tooltip={"Edit"}>
                                <EditSVG className={"small-image-container"}/>
                            </Button>
                            {/*<Button className={"btn-transparent"} onClick={(e) => {e.stopPropagation()}} tooltip={"Copy Pocket"}>*/}
                            {/*    <CopyPocketSVG className={"small-image-container"}/>*/}
                            {/*</Button>*/}
                            {/*<Button className={"btn-transparent"} onClick={this._onShare} tooltip={"Share"}>*/}
                            {/*    <ShareSVG className={"small-image-container"}/>*/}
                            {/*</Button>*/}
                            {/*<Button className={"btn-transparent"} onClick={this._onDownload} tooltip={"Download"}>*/}
                            {/*    <DownloadSVG className={"small-image-container"}/>*/}
                            {/*</Button>*/}
                            <Button className={"btn-transparent"} onClick={() => onDeletePocket(selectedNode.id)} tooltip={"Delete"}>
                                <TrashSVG className={"small-image-container"}/>
                            </Button>
                        </div>
                    );
                    break;
                case "DOCUMENT":
                    optionsDiv = (
                        <div className={'action-bar d-flex h-gap-3'}>
                            <Button className={"btn-transparent"} onClick={() => onDownloadDocument(selectedNode.id)} tooltip={"Download"}>
                                <DownloadSVG className={"small-image-container"}/>
                            </Button>
                            <Button className={"btn-transparent"} onClick={() => onRemoveResource(selectedNode.id, selectedNode.pocket_id)} tooltip={"Remove"}>
                                <TrashSVG className={"small-image-container"}/>
                            </Button>
                        </div>
                    );
                    break;
                case "EXCERPT":
                    optionsDiv = (
                        <div className={'action-bar h-gap-3'}>
                            {/*<Button className={"btn-transparent"} onClick={(e) => {e.stopPropagation()}} tooltip={"Copy to Clipboard"}>*/}
                            {/*    <CopySVG className={"small-image-container"}/>*/}
                            {/*</Button>*/}
                            <Button className={"btn-transparent"} onClick={() => onAddNote(selectedNode.id, selectedNode.excerpt_id, selectedNode.resource_id, selectedNode.pocket_id)} tooltip={"Add Note"}>
                                <AddNoteSVG className={"small-image-container"}/>
                            </Button>
                            <Button className={"btn-transparent"} onClick={() => onRemoveExcerpt(selectedNode.id, selectedNode.pocket_id)} tooltip={"Delete"}>
                                <TrashSVG className={"small-image-container"}/>
                            </Button>
                        </div>
                    );
                    break;
                case "NOTE":
                    optionsDiv = (
                        <div className={'action-bar d-flex h-gap-3'}>
                            {/*<Button className={"btn-transparent"} onClick={(e) => {e.stopPropagation()}} tooltip={"Copy to Clipboard"}>*/}
                            {/*    <CopySVG className={"small-image-container"}/>*/}
                            {/*</Button>*/}
                            <Button className={"btn-transparent"} onClick={() => onEditNote(selectedNode.id)} tooltip={"Edit"}>
                                <EditSVG className={"small-image-container"}/>
                            </Button>
                            <Button className={"btn-transparent"} onClick={() => onRemoveNote(selectedNode.id, selectedNode.pocket_id)} tooltip={"Delete"}>
                                <RemoveSVG className={"small-image-container"}/>
                            </Button>
                        </div>
                    );
                    break;
                case "REPORT":
                    optionsDiv = (
                        <div className={'action-bar d-flex h-gap-3'}>
                            {/*<Button className={"btn-transparent"} onClick={this._onDownload} tooltip={"Download"}>*/}
                            {/*    <DownloadSVG className={"small-image-container"}/>*/}
                            {/*</Button>*/}
                            <Button className={"btn-transparent"} onClick={() => onRemoveReport(selectedNode.id, selectedNode.pocket_id)} tooltip={"Delete"}>
                                <RemoveSVG className={"small-image-container"}/>
                            </Button>
                        </div>
                    );
                    break;
                default:
                    showOptionsBar = false;
                    break;
            }
        } else {
            showOptionsBar = false;
        }

        return (
            <div className={cn}>
                <div className={'system-tool-panel pockets-panel flex-fill h-100 p-4 d-flex flex-column'}>
                    <div className={"d-flex justify-content-between px-3"}>
                        <Button className={"bg-transparent"} onClick={() => onCreatePocket}>
                            <div>Create Pocket</div>
                            <PlusSVG className={"nano-image-container"}/>
                        </Button>
                    </div>
                    <div className={'flex-fill'}>
                        <ScrollBar className={'flex-fill'} renderTrackHorizontal={false}>
                            <TreeView selectionPath={selectionPath}
                                      expandedPaths={expandedPaths}
                                      onSelected={onNodeSelected}
                                      onToggle={onNodeToggle}
                                      rootNodes={data}
                                      showDisclosure={false}
                                      cellContentRenderer={cellContentRenderer}/>
                        </ScrollBar>
                    </div>

                    {
                        showOptionsBar &&
                        <div className={"banner bg-selected d-flex justify-content-between w-100 mt-0 py-2 px-4 h-gap-3"}>
                            <div className={"d-flex h-gap-2 align-items-center overflow-hidden text-primary"}>
                                {/*<div className={"text text-break overflow-hidden text-nowrap font-weight-semi-bold display-4"}>{}</div>*/}
                                {/*<div className={"text text-break overflow-hidden text-nowrap font-weight-light display-4"}>{}</div>*/}
                            </div>
                            <div className={"d-flex h-gap-2 align-items-center"}>
                                {optionsDiv}
                            </div>
                        </div>
                    }
                </div>
            </div>
        );
    }
}

export default PocketsPanelView;
