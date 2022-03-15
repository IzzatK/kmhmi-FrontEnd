import React, {useEffect} from 'react';
import './documentPanel.css';
import {Viewer, Worker} from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import '@react-pdf-viewer/highlight/lib/styles/index.css';
import { toolbarPlugin } from '@react-pdf-viewer/toolbar';
import type { ToolbarSlot } from '@react-pdf-viewer/toolbar';
import type { RenderZoomInProps, RenderZoomOutProps } from '@react-pdf-viewer/zoom';
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
import {NoteSVG} from "../../theme/svgs/noteSVG";
import ComboBox from "../../theme/widgets/comboBox/comboBox";
import TextArea from "../../theme/widgets/textEdit/textArea";
import {DeleteSVG} from "../../theme/svgs/deleteSVG";

function DocumentPdfPreview(props: any) {
    const {className, preview_url, original_url, userProfile, token, permissions, onSaveNote, tmpMethod, documentHighlightAreas, tmpExcerpt, pockets, onPocketSelectionChanged, ...rest} = props;

    // console.log("DocumentPdfPreview " + JSON.stringify(documentHighlightAreas))
    // console.log("pockets2=" + JSON.stringify(pockets));


    const tmp = props;

    const toolbarPluginInstance = toolbarPlugin();
    const { Toolbar } = toolbarPluginInstance;

    function renderHighlightTarget(props: RenderHighlightTargetProps) {
        console.log(JSON.stringify(props))
        return (
            <div className={"note position-absolute d-flex"}
                 style={{
                     left: `${props.selectionRegion.left}%`,
                     top: `${props.selectionRegion.top + props.selectionRegion.height}%`,
                 }}
            >
                <Button className={"btn-transparent"} onClick={props.toggle}>
                    <NoteSVG className={"small-image-container"}/>
                </Button>
            </div>
        );
    };

    const onMessageChange = (message: string) => {
        if (onSaveNote) {
            onSaveNote(message)
        }
    }

    const _onPocketSelectionChanged = (value: string) => {
        if (onPocketSelectionChanged) {
            onPocketSelectionChanged(value);
        }
    }

    function renderHighlightContent(props: RenderHighlightContentProps) {
        const addNote = () => {
            if (tmp.tmpMethod) {
                tmp.tmpMethod(props.selectedText, props.highlightAreas);
            }
            props.cancel();
        };


        // console.log("pockets3=" + JSON.stringify(tmp.pockets));

        let pocketId = tmp.tmpExcerpt["pocket"] ? tmp.tmpExcerpt["pocket"] : "";
        let pocketTitle = "";
        if (tmp.pockets && tmp.pockets[pocketId]) {
            pocketTitle = tmp.pockets[pocketId].title;
        } else {
            pocketTitle = pocketId;
        }

        let note = tmp.tmpExcerpt["note"] ? tmp.tmpExcerpt["note"] : "";

        return (
            <div
                className={"popup d-flex flex-column bg-accent rounded position-absolute"}
                style={{
                    top: `${props.selectionRegion.top + props.selectionRegion.height}%`,
                }}
            >
                <div className={"d-flex flex-column v-gap-2 p-3 position-relative"}>
                    <div className={"position-absolute close"}>
                        <Button className={"btn-transparent"} onClick={props.cancel}>
                            <DeleteSVG className={"nano-image-container"}/>
                        </Button>

                    </div>
                    <div className={"header-3"}>Excerpt</div>
                    <ComboBox
                        items={pockets}
                        title={pocketTitle}
                        onSelect={(value: string) => _onPocketSelectionChanged(value)}
                    />
                    <TextArea
                        className={"p-0"}
                        name={"note"}
                        onChange={(e) => onMessageChange(e)}
                        value={note}
                    />
                </div>
                <div className={"d-flex justify-content-end bg-selected p-3 h-gap-3"}>
                    <Button
                        light={true}
                        text={"Remove"}
                        onClick={props.cancel}
                    />
                    <Button
                        light={true}
                        text={"Save"}
                        onClick={addNote}
                    />
                </div>
            </div>
        );
    };



    function renderHighlights(props: RenderHighlightsProps) {
        // console.log("renderHighlights " + JSON.stringify(tmp.documentHighlightAreas))
        return (
            <div>
                {tmp.documentHighlightAreas?.map((note: any[]) => (
                    <React.Fragment key={JSON.stringify(note)}>
                        {note
                            // Filter all highlights on the current page
                            .filter((area: any) => area.pageIndex === props.pageIndex)
                            .map((area: any, idx: any) => (
                                <div
                                    key={idx}
                                    style={Object.assign(
                                        {},
                                        {
                                            background: 'yellow',
                                            opacity: 0.4,
                                        },
                                        props.getCssProperties(area, props.rotation)
                                    )}
                                />
                            ))}
                    </React.Fragment>
                ))}
            </div>
        );
    }


    let highlightPluginInstance = highlightPlugin({
        renderHighlightTarget,
        renderHighlightContent,
        renderHighlights,
    });

    useEffect(() => {
        console.log("props changed")

    })

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
                                            GoToNextPage,
                                            GoToPreviousPage,
                                            ZoomIn,
                                            ZoomOut,
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
                                                    <ZoomOut>
                                                        {(props: RenderZoomOutProps) => (
                                                            <div onClick={props.onClick}>
                                                                <ZoomOutSVG className={'small-image-container cursor-pointer pdf-icon mx-3'}/>
                                                            </div>
                                                        )}
                                                    </ZoomOut>
                                                </div>

                                                <div className={"toolbar"} style={{ padding: '0px 2px' }}>
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
