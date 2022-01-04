import React from 'react';
import './documentPanel.css';
import {Viewer, Worker} from '@react-pdf-viewer/core';
import {defaultLayoutPlugin} from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import '@react-pdf-viewer/highlight/lib/styles/index.css';
import {DocumentPanelProps} from "./documentPanelModel";
import { toolbarPlugin } from '@react-pdf-viewer/toolbar';
import type { ToolbarSlot, TransformToolbarSlot } from '@react-pdf-viewer/toolbar';
import type { RenderCurrentScaleProps, RenderZoomInProps, RenderZoomOutProps } from '@react-pdf-viewer/zoom';
import type { RenderGoToPageProps } from '@react-pdf-viewer/page-navigation';
import type { RenderDownloadProps } from '@react-pdf-viewer/get-file';
import type { RenderShowSearchPopoverProps } from '@react-pdf-viewer/search';
import type { RenderCurrentPageLabelProps } from '@react-pdf-viewer/page-navigation';
import {ZoomInSVG} from "../../theme/svgs/zoomInSVG";
import {ZoomOutSVG} from "../../theme/svgs/zoomOutSVG";
import {DownloadSVG} from "../../theme/svgs/downloadSVG";
import {TextEditSVG} from "../../theme/svgs/textEditSVG";
import {ArrowLeftSVG} from "../../theme/svgs/arrowLeftSVG";
import {ArrowRightSVG} from "../../theme/svgs/arrowRightSVG";

function DocumentPdfPreview(props: DocumentPanelProps) {
    const {className, preview_url, userProfile, token, ...rest} = props;

    // Create new plugin instance
    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    const toolbarPluginInstance = toolbarPlugin();
    const { Toolbar } = toolbarPluginInstance;

    const transform: TransformToolbarSlot = (slot: ToolbarSlot) => {
        const { NumberOfPages } = slot;
        return Object.assign({}, slot, {
            NumberOfPages: () => (
                <>
                    of <NumberOfPages />
                </>
            ),
        });
    };

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
                                            ShowSearchPopover,
                                            ZoomIn,
                                            ZoomOut,
                                        } = props;
                                        return (
                                            <>
                                                <div style={{ padding: '0px 2px' }}>
                                                    <Download>
                                                        {(props: RenderDownloadProps) => (
                                                            <div onClick={props.onClick}>
                                                                <DownloadSVG className={'small-image-container cursor-pointer pdf-icon mx-5'}/>
                                                            </div>
                                                        )}
                                                    </Download>
                                                </div>

                                                <div style={{ padding: '0px 2px' }}>
                                                    <ShowSearchPopover>
                                                        {(props: RenderShowSearchPopoverProps) => (
                                                            <div onClick={props.onClick}>
                                                                <TextEditSVG className={'small-image-container cursor-pointer pdf-icon mx-3'}/>
                                                            </div>
                                                        )}
                                                    </ShowSearchPopover>
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
                                        // highlightPluginInstance
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

const renderPage = (props: any) => {
    return (
        <div>
            {props.canvasLayer.children}
            <div style={{ backgroundColor: 'red' }}>
                {props.textLayer.children}
            </div>
            {props.annotationLayer.children}
        </div>
    );
};

export default DocumentPdfPreview;
