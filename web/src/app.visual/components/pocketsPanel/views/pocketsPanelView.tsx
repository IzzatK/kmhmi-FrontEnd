import React, {Component} from 'react';
import '../pocketsPanel.css';
import {PocketsPanelViewProps} from "../pocketsPanelModel";
import Button from "../../../theme/widgets/button/button";
import {PlusSVG} from "../../../theme/svgs/plusSVG";
import TreeView from "../../../theme/widgets/treeView/treeView";
import ScrollBar from "../../../theme/widgets/scrollBar/scrollBar";
import {CreateReportSVG} from "../../../theme/svgs/createReportSVG";
import {EditSVG} from "../../../theme/svgs/editSVG";
import {DownloadSVG} from "../../../theme/svgs/downloadSVG";
import {TrashSVG} from "../../../theme/svgs/trashSVG";
import {AddNoteSVG} from "../../../theme/svgs/addNoteSVG";
import {FileSVG} from "../../../theme/svgs/fileSVG";
import Popup from "../../../theme/widgets/popup/popup";
import {TooltipPosition} from "../../../theme/widgets/tooltipPortal/tooltipPortalModel";

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
            onDownloadResource,
            onAddNoteToExcerpt,
            onAddNoteToResource,
            onAddNoteToPocket,
            onEditNote,
            showPopup,
            setShowPopup,
            onDelete
        } = this.props;

        let cn = "d-flex position-absolute w-100 h-100 align-items-center justify-content-center";

        if (className) {
            cn += ` ${className}`;
        }

        let optionsDiv: JSX.Element = (<div/>);

        let showOptionsBar = true;
        let popupText = "item";

        if (selectedNode) {
            switch (selectedNode.type) {
                case "POCKET":
                    popupText = "pocket"

                    optionsDiv = (
                        <div className={`action-bar d-flex h-gap-3`}>
                            <Button className={"btn-transparent"} onClick={() => onAddNoteToPocket(selectedNode.id)} tooltip={"Add Note"} tooltipPosition={TooltipPosition.TOP}>
                                <AddNoteSVG className={"small-image-container"}/>
                            </Button>
                            <Button className={"btn-transparent"} onClick={() => onCreateReport(selectedNode.pocket_id)} tooltip={"Create Report"} tooltipPosition={TooltipPosition.TOP}>
                                <CreateReportSVG className={"small-image-container"}/>
                            </Button>
                            <Button className={"btn-transparent"} onClick={() => onEditPocket(selectedNode.id)} tooltip={"Edit"} tooltipPosition={TooltipPosition.TOP}>
                                <EditSVG className={"small-image-container"}/>
                            </Button>
                            {/*<Button className={"btn-transparent"} onClick={(e) => {e.stopPropagation()}} tooltip={"Copy Pocket"} tooltipPosition={TooltipPosition.TOP}>*/}
                            {/*    <CopyPocketSVG className={"small-image-container"}/>*/}
                            {/*</Button>*/}
                            {/*<Button className={"btn-transparent"} onClick={this._onShare} tooltip={"Share"} tooltipPosition={TooltipPosition.TOP}>*/}
                            {/*    <ShareSVG className={"small-image-container"}/>*/}
                            {/*</Button>*/}
                            {/*<Button className={"btn-transparent"} onClick={this._onDownload} tooltip={"Download"} tooltipPosition={TooltipPosition.TOP}>*/}
                            {/*    <DownloadSVG className={"small-image-container"}/>*/}
                            {/*</Button>*/}
                            <Button className={"btn-transparent"} onClick={() => setShowPopup(true)} tooltip={"Delete"} tooltipPosition={TooltipPosition.TOP}>
                                <TrashSVG className={"small-image-container"}/>
                            </Button>
                        </div>
                    );
                    break;
                case "DOCUMENT":
                    popupText = "document"

                    optionsDiv = (
                        <div className={'action-bar d-flex h-gap-3'}>
                            <Button className={"btn-transparent"} onClick={() => onAddNoteToResource(selectedNode.pocket_id, selectedNode.id)} tooltip={"Add Note"} tooltipPosition={TooltipPosition.TOP}>
                                <AddNoteSVG className={"small-image-container"}/>
                            </Button>
                            <Button className={"btn-transparent"} onClick={() => onDownloadResource(selectedNode.id)} tooltip={"Download"} tooltipPosition={TooltipPosition.TOP}>
                                <DownloadSVG className={"small-image-container"}/>
                            </Button>
                            <Button className={"btn-transparent"} onClick={() => setShowPopup(true)} tooltip={"Remove"} tooltipPosition={TooltipPosition.TOP}>
                                <TrashSVG className={"small-image-container"}/>
                            </Button>
                        </div>
                    );
                    break;
                case "EXCERPT":
                    popupText = "excerpt"

                    optionsDiv = (
                        <div className={'action-bar d-flex h-gap-3'}>
                            {/*<Button className={"btn-transparent"} onClick={(e) => {e.stopPropagation()}} tooltip={"Copy to Clipboard"} tooltipPosition={TooltipPosition.TOP}>*/}
                            {/*    <CopySVG className={"small-image-container"}/>*/}
                            {/*</Button>*/}
                            <Button className={"btn-transparent"} onClick={() => onAddNoteToExcerpt(selectedNode.pocket_id, selectedNode.resource_id, selectedNode.id)} tooltip={"Add Note"} tooltipPosition={TooltipPosition.TOP}>
                                <AddNoteSVG className={"small-image-container"}/>
                            </Button>
                            <Button className={"btn-transparent"} onClick={() => setShowPopup(true)} tooltip={"Delete"} tooltipPosition={TooltipPosition.TOP}>
                                <TrashSVG className={"small-image-container"}/>
                            </Button>
                        </div>
                    );
                    break;
                case "NOTE":
                    popupText = "note"

                    optionsDiv = (
                        <div className={'action-bar d-flex h-gap-3'}>
                            {/*<Button className={"btn-transparent"} onClick={(e) => {e.stopPropagation()}} tooltip={"Copy to Clipboard"} tooltipPosition={TooltipPosition.TOP}>*/}
                            {/*    <CopySVG className={"small-image-container"}/>*/}
                            {/*</Button>*/}
                            <Button className={"btn-transparent"} onClick={() => onEditNote(selectedNode.id, selectedNode.pocket_id, selectedNode.resource_id, selectedNode.excerpt_id)} tooltip={"Edit"} tooltipPosition={TooltipPosition.TOP}>
                                <EditSVG className={"small-image-container"}/>
                            </Button>
                            <Button className={"btn-transparent"} onClick={() => setShowPopup(true)} tooltip={"Delete"} tooltipPosition={TooltipPosition.TOP}>
                                <TrashSVG className={"small-image-container"}/>
                            </Button>
                        </div>
                    );
                    break;
                case "REPORT":
                    popupText = "report"

                    optionsDiv = (
                        <div className={'action-bar d-flex h-gap-3'}>
                            {/*<Button className={"btn-transparent"} onClick={this._onDownload} tooltip={"Download"} tooltipPosition={TooltipPosition.TOP}>*/}
                            {/*    <DownloadSVG className={"small-image-container"}/>*/}
                            {/*</Button>*/}
                            <Button className={"btn-transparent"} onClick={() => setShowPopup(true)} tooltip={"Delete"} tooltipPosition={TooltipPosition.TOP}>
                                <TrashSVG className={"small-image-container"}/>
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
                <Popup
                    text={`Are you sure you want to remove the selected ${popupText}?`}
                    proceedText={"Delete"}
                    cancelText={"Cancel"}
                    graphic={FileSVG}
                    isVisible={showPopup}
                    padding={"30%"}
                    onCancel={() => setShowPopup(false)}
                    onProceed={onDelete}
                />
                <div className={'system-tool-panel pockets-panel flex-fill h-100 d-flex flex-column'}>
                    <div className={"d-flex justify-content-between px-3 mx-4 mt-4"}>
                        <Button className={"bg-transparent"} onClick={onCreatePocket}>
                            <div>Create Pocket</div>
                            <PlusSVG className={"nano-image-container"}/>
                        </Button>
                    </div>
                    <div className={'flex-fill mx-4'}>
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
