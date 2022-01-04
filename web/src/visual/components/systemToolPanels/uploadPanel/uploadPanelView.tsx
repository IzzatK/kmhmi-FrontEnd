import React, {Component} from 'react';
import './uploadPanel.css';
import '../../../theme/stylesheets/panel.css';
import FileInput from "../../../theme/widgets/fileInput/fileInput";
import Card from "../../../theme/widgets/card/card";
import Button from "../../../theme/widgets/button/button";
import {DeleteSVG} from "../../../theme/svgs/deleteSVG";
import {CSSTransition, TransitionGroup} from "react-transition-group";
import {getClassNames} from "../../../../framework.visual/extras/utils/animationUtils";
import ScrollBar from "../../../theme/widgets/scrollBar/scrollBar";
import {LoadingIndicator} from "../../../theme/widgets/loadingIndicator/loadingIndicator";
import {PendingDocumentVM, UploadPanelProps, UploadPanelState} from "./uploadPanelModel";
import {RemoveSVG} from "../../../theme/svgs/removeSVG";
import {AcceptSVG} from "../../../theme/svgs/acceptSVG";

class UploadPanelView extends Component<UploadPanelProps, UploadPanelState> {
    constructor(props: any, context: any) {
        super(props, context);

        this.state = {
            lastSelected: {},
        }
    }

    render() {
        const {
            className,
            pendingFiles,
            onPendingDocumentAdded,
            onPendingDocumentRemoved,
            onDocumentSelected
        } = this.props;
        const {lastSelected} = this.state;

        let cn = "system-tool-panel upload-panel p-4 d-flex flex-column align-items-start justify-content-between v-gap-5";

        if (className) {
            cn += ` ${className}`;
        }

        const _onSelected = (files: PendingDocumentVM[]) => {
            if (onPendingDocumentAdded) {
                onPendingDocumentAdded(files)
            }
            this.setState({
                ...this.state,
                lastSelected: null,
            })
        }

        let pendingDocumentsDiv: JSX.Element[] = [];

        const _onDocumentSelected = (id: string, event?: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            const { pendingFiles } = this.props;

            if (event) {
                event.preventDefault();
            }

            if (pendingFiles[id]) {
                pendingFiles[id].selected = true;
            }

            onDocumentSelected(id);
        }

        const _onPendingDocumentRemoved = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, id: string) => {
            event.stopPropagation();
            onPendingDocumentRemoved(id);
        }

        if (pendingFiles) {
            pendingDocumentsDiv = Object.entries(pendingFiles).map(([key, pendingDocument]) => {
                const { id, file_name, status, isUpdating, selected} = pendingDocument;

                return (
                    <CSSTransition key={id} timeout={300} classNames={getClassNames('fadeIn', 'fadeIn', 'slideRightOut') }>
                        <div className={'position-relative pending-item'}>
                            <Card className={`d-flex flex-column align-items-stretch v-gap-3 p-0 ${isUpdating ? 'loading' : ''}`} selected={selected} onClick={() => _onDocumentSelected(id)}
                                  header={
                                      <div className={'d-flex'}>
                                          <div className={'flex-fill d-flex justify-content-between align-items-center'}>
                                              <div className={'pending-item-body flex-fill d-flex justify-content-between align-items-center'}>
                                                  <div className={'d-flex flex-column v-gap-3 p-4'}>
                                                      <div className={"display-2 text-secondary"}>{file_name}</div>
                                                      {/*<div className={"header-5 text-secondary"}>{status}</div>*/}
                                                  </div>
                                                  <div className={'d-flex align-items-center justify-content-center p-2'}>
                                                      <Button className={'btn-transparent loading-button'} onClick={(event) => _onPendingDocumentRemoved(event, id)}>
                                                          <RemoveSVG className={"small-image-container"}/>
                                                      </Button>
                                                  </div>

                                              </div>
                                              {
                                                  !isUpdating && selected &&
                                                  <div className={'d-flex h-gap-3 px-5'}>
                                                      <Button className={'p-2 reject'} onClick={(event) => _onPendingDocumentRemoved(event, id)}>
                                                          <DeleteSVG className={"small-image-container"}/>
                                                      </Button>
                                                      <Button className={'p-2 accept'} >
                                                          <AcceptSVG className={"small-image-container"}/>
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
                    <FileInput className={'flex-fill'} onSelected={_onSelected} selected={lastSelected}/>
                </div>
            </div>
        );
    }
}

export default UploadPanelView;
