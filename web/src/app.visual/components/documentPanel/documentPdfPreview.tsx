import React from 'react';
import './documentPanel.css';
import {Viewer, Worker} from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import '@react-pdf-viewer/highlight/lib/styles/index.css';
import {DocumentPanelProps} from "./documentPanelModel";
import { toolbarPlugin } from '@react-pdf-viewer/toolbar';
import type { ToolbarSlot } from '@react-pdf-viewer/toolbar';
import type { RenderZoomInProps, RenderZoomOutProps } from '@react-pdf-viewer/zoom';
import type { RenderGoToPageProps } from '@react-pdf-viewer/page-navigation';
import type { RenderDownloadProps } from '@react-pdf-viewer/get-file';
import type { RenderCurrentPageLabelProps } from '@react-pdf-viewer/page-navigation';
import {SelectionData, highlightPlugin, RenderHighlightTargetProps} from '@react-pdf-viewer/highlight';
import {ZoomInSVG} from "../../theme/svgs/zoomInSVG";
import {ZoomOutSVG} from "../../theme/svgs/zoomOutSVG";
import {DownloadSVG} from "../../theme/svgs/downloadSVG";
import {TextEditSVG} from "../../theme/svgs/textEditSVG";
import {ArrowLeftSVG} from "../../theme/svgs/arrowLeftSVG";
import {ArrowRightSVG} from "../../theme/svgs/arrowRightSVG";
import Button from "../../theme/widgets/button/button";
import ComboBox from "../../theme/widgets/comboBox/comboBox";
import TextArea from "../../theme/widgets/textEdit/textArea";
import Popup from "../../theme/widgets/popup/popup";

function DocumentPdfPreview(props: DocumentPanelProps) {
    const {className, preview_url, original_url, userProfile, token, permissions, ...rest} = props;

    const toolbarPluginInstance = toolbarPlugin();
    const { Toolbar } = toolbarPluginInstance;

    const renderHighlightTarget = (props: RenderHighlightTargetProps) => {
        //can page range from here - maybe add popup here though that might be tricky
        return (
            <div/>
        );
    };

    const highlightPluginInstance = highlightPlugin({renderHighlightTarget});

    const _download = () => {
        let username = userProfile.username;
        let id = userProfile.id;
        let email = userProfile.email;
        let firstName = userProfile.firstName;
        let lastName = userProfile.lastName;

        let xhr = new XMLHttpRequest;

        xhr.open( "GET", original_url || "");

        xhr.addEventListener( "load", function(){
            window.open(original_url);
        }, false);

        xhr.setRequestHeader("km_token", `bearer ${token}` );
        xhr.setRequestHeader("km_user_name", username );
        xhr.setRequestHeader("km_user_id", id );
        xhr.setRequestHeader("km_email", email );
        xhr.setRequestHeader("km_first_name", firstName );
        xhr.setRequestHeader("km_last_name", lastName );

        xhr.send();
    }

    let cn = "pdf-viewer flex-fill align-self-stretch";
    if (className) {
        cn += ` ${className}`;
    }

    let username: string = '';
    let id: string = '';
    let email: string = '';
    let firstName: string = '';
    let lastName: string = '';
    if (userProfile) {
        username = userProfile.username;
        id = userProfile.id;
        email = userProfile.email;
        firstName = userProfile.firstName;
        lastName = userProfile.lastName;
    }

    return (
        <div className={cn} {...rest}>
            {
                preview_url.length &&
                <div className={"position-relative w-100 h-100"}>
                    <div className={"position-absolute overflow-hidden w-100 h-100"}>
                        <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.10.377/build/pdf.worker.min.js">

                            <div
                                style={{
                                    alignItems: 'center',
                                    backgroundColor: 'transparent',
                                    borderBottom: '0',
                                    display: 'flex',
                                    padding: '24px',
                                }}
                            >
                                <Toolbar>
                                    {(props: ToolbarSlot) => {
                                        const {
                                            CurrentPageLabel,
                                            Download,
                                            GoToNextPage,
                                            GoToPreviousPage,
                                            ZoomIn,
                                            ZoomOut,
                                        } = props;
                                        return (
                                            <>
                                                <div style={{ padding: '0px 2px' }}>
                                                    {
                                                        permissions.canDownload &&
                                                        <Button onClick={() => _download()}>
                                                            <DownloadSVG className={'small-image-container cursor-pointer pdf-icon mx-5'}/>
                                                        </Button>
                                                    }
                                                    {/*<Download>*/}
                                                    {/*    {(props: RenderDownloadProps) => (*/}
                                                    {/*        <div onClick={props.onClick}>*/}
                                                    {/*            */}
                                                    {/*        </div>*/}
                                                    {/*    )}*/}
                                                    {/*</Download>*/}
                                                </div>


                                                <div style={{ padding: '0px 2px' }}>
                                                    <Button>
                                                        <TextEditSVG className={'small-image-container cursor-pointer pdf-icon mx-3'}/>
                                                    </Button>
                                                </div>

                                                <div style={{ padding: '0px 2px',  marginLeft: 'auto' }}>
                                                    <GoToPreviousPage>
                                                        {(props: RenderGoToPageProps) => (
                                                            <div onClick={props.onClick}>
                                                                <ArrowLeftSVG className={'nano-image-container cursor-pointer pagination'}/>
                                                            </div>
                                                        )}
                                                    </GoToPreviousPage>
                                                </div>

                                                <div style={{ padding: '0px 2px' }}>
                                                    <CurrentPageLabel>
                                                        {(props: RenderCurrentPageLabelProps) => (
                                                            <div className={'pagination'}>
                                                                <span>
                                                                    {`${props.currentPage + 1} / ${props.numberOfPages}`}
                                                                </span>

                                                            </div>
                                                        )}
                                                    </CurrentPageLabel>
                                                </div>

                                                <div style={{ padding: '0px 2px' }}>
                                                    <GoToNextPage>
                                                        {(props: RenderGoToPageProps) => (
                                                            <div onClick={props.onClick}>
                                                                <ArrowRightSVG className={'nano-image-container cursor-pointer pagination'}/>
                                                            </div>
                                                        )}
                                                    </GoToNextPage>
                                                </div>

                                                <div style={{ padding: '0px 2px', marginLeft: 'auto' }}>
                                                    <ZoomOut>
                                                        {(props: RenderZoomOutProps) => (
                                                            <div onClick={props.onClick}>
                                                                <ZoomOutSVG className={'small-image-container cursor-pointer pdf-icon mx-3'}/>
                                                            </div>
                                                        )}
                                                    </ZoomOut>
                                                </div>

                                                <div style={{ padding: '0px 2px' }}>
                                                    <ZoomIn>
                                                        {(props: RenderZoomInProps) => (
                                                            <div onClick={props.onClick}>
                                                                <ZoomInSVG className={'small-image-container cursor-pointer pdf-icon mx-5'}/>
                                                            </div>
                                                        )}
                                                    </ZoomIn>
                                                </div>

                                            </>
                                        );
                                    }}
                                </Toolbar>
                            </div>
                            <Viewer fileUrl={preview_url}
                                    plugins={[
                                        // Register application
                                        // defaultLayoutPluginInstance,
                                        toolbarPluginInstance,
                                        highlightPluginInstance,
                                    ]}
                                    theme={'dark'}
                                    httpHeaders={{
                                        'km_token': `bearer ${token}`,
                                        'km_user_name': username,
                                        'km_user_id': id,
                                        'km_email': email,
                                        'km_first_name': firstName,
                                        'km_last_name': lastName,
                                    }}
                            />
                        </Worker>
                    </div>

                </div>
            }
        </div>
    );
}

export default DocumentPdfPreview;
