import React from 'react';
import './documentPanel.css';
import {Viewer, Worker} from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import '@react-pdf-viewer/highlight/lib/styles/index.css';
import { toolbarPlugin } from '@react-pdf-viewer/toolbar';
import type { ToolbarSlot } from '@react-pdf-viewer/toolbar';
import { zoomPlugin, RenderZoomProps } from '@react-pdf-viewer/zoom';
import type { RenderGoToPageProps } from '@react-pdf-viewer/page-navigation';
import type { RenderCurrentPageLabelProps } from '@react-pdf-viewer/page-navigation';
import {
    highlightPlugin,
    RenderHighlightContentProps,
    RenderHighlightsProps,
    RenderHighlightTargetProps
} from '@react-pdf-viewer/highlight';
import {ZoomInSVG} from "../../theme/svgs/zoomInSVG";
import {ZoomOutSVG} from "../../theme/svgs/zoomOutSVG";
import {DownloadSVG} from "../../theme/svgs/downloadSVG";
import {TextEditSVG} from "../../theme/svgs/textEditSVG";
import {ArrowLeftSVG} from "../../theme/svgs/arrowLeftSVG";
import {ArrowRightSVG} from "../../theme/svgs/arrowRightSVG";
import Button from "../../theme/widgets/button/button";
import {DocumentPdfPreviewProps} from "./documentPanelModel";
import {renderHighlightContent, renderHighlights, renderHighlightTarget} from "./highlightPlugin";

function DocumentPdfPreview(props: DocumentPdfPreviewProps) {
    const {
        className,
        preview_url,
        original_url,
        userProfile,
        token,
        permissions,
        onUpdateTmpNote,
        onCreateExcerpt,
        tmpExcerpt,
        pockets,
        onPocketSelectionChanged,
        onZoom,
        zoomScale,
        ...rest
    } = props;

    const toolbarPluginInstance = toolbarPlugin();
    const { Toolbar } = toolbarPluginInstance;

    const zoomPluginInstance = zoomPlugin();
    const { Zoom } = zoomPluginInstance;

    const highlightPluginInstance = highlightPlugin({
        renderHighlightTarget: (pluginProps: RenderHighlightTargetProps) => renderHighlightTarget(pluginProps, props),
        renderHighlightContent: (pluginProps: RenderHighlightContentProps) => renderHighlightContent(pluginProps, props),
        renderHighlights: (pluginProps: RenderHighlightsProps) => renderHighlights(pluginProps, props),
    });

    const _download = () => {

        let xhr = new XMLHttpRequest();

        xhr.open( "GET", preview_url || "");

        xhr.setRequestHeader("Authorization", `bearer ${token}` );

        xhr.responseType = "blob";
        xhr.onload = function () {
            //Create a Blob from the PDF Stream
            const file = new Blob([xhr.response], { type: "application/pdf" });
            //Build a URL from the file
            const fileURL = URL.createObjectURL(file);
            //Open the URL on new Window
            const pdfWindow = window.open();
            if (pdfWindow) {
                pdfWindow.location.href = fileURL;
            }
        };

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

    const _onZoomIn = (props: RenderZoomProps) => {
        if (props.scale < 4) {
            onZoom(props.scale + 0.25);
            props.onZoom(props.scale + 0.25);
        }
    }

    const _onZoomOut = (props: RenderZoomProps) => {
        if (props.scale > 0.25) {
            onZoom(props.scale - 0.25);
            props.onZoom(props.scale - 0.25);
        }
    }

    return (
        <div className={cn} {...rest}>
            {
                preview_url.length &&
                <div className={"position-relative w-100 h-100"}>
                    <div className={"position-absolute overflow-hidden w-100 h-100"}>
                        <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.13.216/build/pdf.worker.min.js">

                            <div
                                style={{
                                    alignItems: 'center',
                                    backgroundColor: 'transparent',
                                    borderBottom: '0',
                                    display: 'flex',
                                    padding: '2.4rem',
                                }}
                            >
                                <Toolbar>
                                    {(props: ToolbarSlot) => {
                                        const {
                                            CurrentPageLabel,
                                            GoToNextPage,
                                            GoToPreviousPage,
                                        } = props;
                                        return (
                                            <>
                                                <div className={"toolbar"} style={{ padding: '0px 2px' }}>
                                                    {
                                                        permissions.canDownload &&
                                                        <Button onClick={() => _download()}>
                                                            <DownloadSVG className={'small-image-container cursor-pointer pdf-icon mx-5'}/>
                                                        </Button>
                                                    }
                                                </div>


                                                <div className={"toolbar"} style={{ padding: '0px 2px' }}>
                                                    <Button>
                                                        <TextEditSVG className={'small-image-container cursor-pointer pdf-icon mx-3'}/>
                                                    </Button>
                                                </div>

                                                <div className={"toolbar"} style={{ padding: '0px 2px',  marginLeft: 'auto' }}>
                                                    <GoToPreviousPage>
                                                        {(props: RenderGoToPageProps) => (
                                                            <div onClick={props.onClick}>
                                                                <ArrowLeftSVG className={'nano-image-container cursor-pointer pagination'}/>
                                                            </div>
                                                        )}
                                                    </GoToPreviousPage>
                                                </div>

                                                <div className={"toolbar"} style={{ padding: '0px 2px' }}>
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

                                                <div className={"toolbar"} style={{ padding: '0px 2px' }}>
                                                    <GoToNextPage>
                                                        {(props: RenderGoToPageProps) => (
                                                            <div onClick={props.onClick}>
                                                                <ArrowRightSVG className={'nano-image-container cursor-pointer pagination'}/>
                                                            </div>
                                                        )}
                                                    </GoToNextPage>
                                                </div>

                                                <div className={"toolbar"} style={{ padding: '0px 2px', marginLeft: 'auto' }}>
                                                    <Zoom levels={[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3]}>
                                                        {(props: RenderZoomProps) => (
                                                            <div onClick={() => _onZoomOut(props)}>
                                                                <ZoomOutSVG className={'small-image-container cursor-pointer pdf-icon mx-3'}/>
                                                            </div>
                                                        )}
                                                    </Zoom>
                                                </div>

                                                <div className={"toolbar"} style={{ padding: '0px 2px' }}>
                                                    <Zoom levels={[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3]}>
                                                        {(props: RenderZoomProps) => (
                                                            <div onClick={() => _onZoomIn(props)}>
                                                                <ZoomInSVG className={'small-image-container cursor-pointer pdf-icon mx-5'}/>
                                                            </div>
                                                        )}
                                                    </Zoom>
                                                </div>

                                            </>
                                        );
                                    }}
                                </Toolbar>
                            </div>
                            <Viewer fileUrl={preview_url}
                                    plugins={[
                                        toolbarPluginInstance,
                                        highlightPluginInstance,
                                        zoomPluginInstance,
                                    ]}
                                    theme={'dark'}
                                    httpHeaders={{
                                        'Authorization': `bearer ${token}`,
                                        // 'km-user-name': username,
                                        // 'km-user-id': id,
                                        // 'km-email': email,
                                        // 'km-first-name': firstName,
                                        // 'km-last-name': lastName,
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
