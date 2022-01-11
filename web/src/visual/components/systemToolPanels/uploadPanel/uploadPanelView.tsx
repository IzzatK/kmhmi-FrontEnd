import React, {Component} from 'react';
import './uploadPanel.css';
import '../../../theme/stylesheets/panel.css';
import FileInput from "../../../theme/widgets/fileInput/fileInput";
import Card from "../../../theme/widgets/card/card";
import Button from "../../../theme/widgets/button/button";
import {CSSTransition, TransitionGroup} from "react-transition-group";
import {getClassNames} from "../../../../framework.visual/extras/utils/animationUtils";
import ScrollBar from "../../../theme/widgets/scrollBar/scrollBar";
import {LoadingIndicator} from "../../../theme/widgets/loadingIndicator/loadingIndicator";
import {PendingDocumentVM, UploadPanelProps, UploadPanelState} from "./uploadPanelModel";
import {RemoveSVG} from "../../../theme/svgs/removeSVG";
import {ApproveSVG} from "../../../theme/svgs/approveSVG";
import Popup from "../../../theme/widgets/popup/popup";
import {FileSVG} from "../../../theme/svgs/fileSVG";
import {bindInstanceMethods} from "../../../../framework/extras/typeUtils";

class UploadPanelView extends Component<UploadPanelProps, UploadPanelState> {
    constructor(props: any, context: any) {
        super(props, context);

        bindInstanceMethods(this);

        this.state = {
            showPopup: false,
            selectedId: "",
        }
    }

    componentDidMount() {
    }

    componentDidUpdate(prevProps: Readonly<UploadPanelProps>, prevState: Readonly<UploadPanelState>, snapshot?: any) {

    }

    _onApproved = (id: string) => {
        const { onPendingDocumentApproved } = this.props;

        if ( onPendingDocumentApproved ) {
            onPendingDocumentApproved(id);
        }
    }

    _onSelected = (files: PendingDocumentVM[]) => {
        const { onPendingDocumentAdded } = this.props;
        if (onPendingDocumentAdded) {
            onPendingDocumentAdded(files)
        }
    }

    _onDocumentSelected = (id: string, event?: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const { pendingFiles, onDocumentSelected } = this.props;
        const { selectedId } = this.state;

        if (event) {
            event.preventDefault();
        }

        if (pendingFiles[id]) {
            pendingFiles[id].selected = true;
        }

        if (id !== selectedId) {
            this._setSelectedId(id);
        }

        onDocumentSelected(id);
    }

    _setSelectedId(id: string) {
        this.setState({
            ...this.state,
            selectedId: id,
        })
    }

    _setPopupVisible(visible: boolean) {
        this.setState({
            ...this.state,
            showPopup: visible,
        })
    }

    _onPendingDocumentRemoved = (id: string) => {
        const { onPendingDocumentRemoved } = this.props;

        onPendingDocumentRemoved(id);
        this._setPopupVisible(false);
    }

    _onCancelUpload = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, id: string) => {
        const { onCancelUpload } = this.props;

        event.stopPropagation();
        if (onCancelUpload) {
            onCancelUpload(id);
        }
    }

    render() {
        const {
            className,
            pendingFiles,
        } = this.props;

        const { showPopup, selectedId } = this.state;

        let cn = "system-tool-panel upload-panel p-4 d-flex flex-column align-items-start justify-content-between v-gap-5";

        if (className) {
            cn += ` ${className}`;
        }

        let pendingDocumentsDiv: JSX.Element[] = [];

        if (pendingFiles) {
            pendingDocumentsDiv = Object.entries(pendingFiles).map(([key, pendingDocument]) => {
                const { id, file_name, status, isUpdating, selected, deleted} = pendingDocument;

                return (
                    <CSSTransition key={id} timeout={300} classNames={getClassNames('fadeIn', 'fadeIn', 'slideRightOut') }>
                        <div className={'position-relative pending-item'}>
                            <Card className={`d-flex flex-column align-items-stretch v-gap-3 p-0 ${isUpdating ? 'loading' : ''} ${deleted ? "deleted" : ""}`} selected={selected} onClick={() => this._onDocumentSelected(id)}
                                  header={
                                      <div className={'d-flex'}>
                                          <div className={'flex-fill d-flex justify-content-between align-items-center pending-item-container'}>
                                              <div className={'pending-item-body flex-fill d-flex justify-content-between align-items-center shadow'}>
                                                  <div className={`d-flex h-gap-1 px-3 pt-3 ${deleted ? "pb-3" : "pb-5"}`}>
                                                      {
                                                          deleted &&
                                                          <div className={"display-2 font-weight-semi-bold"}>Deleted</div>
                                                      }
                                                      <div className={`display-2 ${deleted ? "text-info" : "text-secondary"}`}>{file_name}</div>
                                                  </div>
                                                  {
                                                      !deleted &&
                                                      <div className={'d-flex align-items-center justify-content-center p-2'}>
                                                          <Button className={'btn-transparent loading-button'} onClick={(event) => this._onCancelUpload(event, id)}>
                                                              <RemoveSVG className={"small-image-container"}/>
                                                          </Button>
                                                      </div>
                                                  }


                                              </div>
                                              {
                                                  (!isUpdating && selected && !deleted) &&
                                                  <div className={'d-flex h-gap-3 px-4'}>
                                                      <Button className={'p-2 reject'} onClick={() => this._setPopupVisible(true)}>
                                                          <RemoveSVG className={"small-image-container"}/>
                                                      </Button>
                                                      <Button className={'p-2 accept'} onClick={() => this._onApproved(id)}>
                                                          <ApproveSVG className={"small-image-container"}/>
                                                      </Button>
                                                  </div>
                                              }
                                          </div>

                                          {/*{*/}
                                          {/*    percentComplete > 0 &&*/}
                                          {/*    <ProgressBar className={'w-100'} percent={percentComplete} style={{height: '0.8rem'}}/>*/}
                                          {/*}*/}
                                      </div>
                                  }
                            />
                            {
                                isUpdating &&
                                <div className={"position-absolute"} style={{top: '0', right: '0', bottom: '0', left:'0'}}>
                                    <LoadingIndicator/>
                                </div>
                            }
                        </div>

                    </CSSTransition>
                );
            })
        }

        return (
            <div className={cn}>
                <div className={'header-1 title py-3'}>UPLOAD MANAGER</div>
                <div className={'header align-self-stretch d-flex align-items-center justify-content-between p-3 mt-3'}>
                    <div className={"py-3"}>UPLOADS</div>
                </div>
                <Popup
                    text={"Are you sure you want to remove the selected file?"}
                    proceedText={"Delete"}
                    cancelText={"Cancel"}
                    graphic={FileSVG}
                    isVisible={showPopup}
                    padding={"30%"}
                    onCancel={() => this._setPopupVisible(false)}
                    onProceed={() => this._onPendingDocumentRemoved(selectedId)}/>
                {
                    pendingDocumentsDiv && pendingDocumentsDiv.length > 0 ?
                        <ScrollBar renderTrackHorizontal={false}>
                            <div className={"search-results pr-3 v-gap-3"}>
                                <TransitionGroup component={null}>
                                    {pendingDocumentsDiv}
                                </TransitionGroup>
                            </div>
                        </ScrollBar>
                        :
                        <div className={'flex-fill align-self-stretch d-flex align-items-center justify-content-center'}>
                            <div className={'text-primary header-1'}>No Pending Files</div>
                        </div>
                }

                <div className={'align-self-stretch d-flex flex-column align-items-stretch v-gap-3'}>
                    <FileInput className={'flex-fill'} onSelected={this._onSelected}/>
                </div>
            </div>
        );
    }
}

export default UploadPanelView;
