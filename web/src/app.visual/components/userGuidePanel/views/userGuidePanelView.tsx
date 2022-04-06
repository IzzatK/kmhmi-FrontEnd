import {UserGuidePanelViewProps} from "../userGuidePanelModel";
import ScrollBar from "../../../theme/widgets/scrollBar/scrollBar";
import {TransitionGroup} from "react-transition-group";
import React from "react";
import DocumentPdfPreview from "../../documentPanel/documentPdfPreview";
import {nameOf} from "../../../../framework.core/extras/utils/typeUtils";
import {CreateExcerptEventData} from "../../documentPanel/documentPanelModel";
import {LoadingIndicator} from "../../../theme/widgets/loadingIndicator/loadingIndicator";

function UserGuidePanelView(props: UserGuidePanelViewProps) {
    const {className} = props;

    let cn = "d-flex position-absolute w-100 h-100 align-items-center justify-content-center";

    if (className) {
        cn += ` ${className}`;
    }

    return (
        <div className={cn}>
            <div className={'system-tool-panel tags-panel flex-fill h-100 py-4 pl-4 d-flex flex-column'}>
                <div className={'header-1 title py-3'}>USER REFERENCE GUIDE</div>
                <div className={"body flex-fill d-flex align-self-stretch position-relative"}>
                    {
                        // id ?
                        //     preview_url.length > 0 ?
                        //         <DocumentPdfPreview
                        //             preview_url={preview_url}
                        //             original_url={original_url || ""}
                        //             userProfile={userProfile}
                        //             token={token}
                        //             permissions={permissions}
                        //             excerpts={excerpts}
                        //             tmpExcerpt={tmpExcerpt}
                        //             pockets={pockets}
                        //             zoomScale={zoomScale}
                        //             onUpdateTmpNote={(text: string) => this._onTmpNoteChanged(nameOf<CreateExcerptEventData>("note_text"), text)}
                        //             onCreateExcerpt={this._onCreateExcerpt}
                        //             onSaveNote={onSaveNote}
                        //             onPocketSelectionChanged={(value: string) => this._onTmpExcerptChanged(nameOf<CreateExcerptEventData>("pocketId"), value)}
                        //             onZoom={this._onZoom}
                        //         />
                        //         :
                        //         <div className={"position-relative w-100 h-100"}>
                        //             <LoadingIndicator/>
                        //         </div>
                        //     :
                            <div
                                className={'flex-fill d-flex flex-column align-items-center justify-content-center v-gap-5 bg-tertiary'}>
                                <div className={'display-4 text-accent font-weight-semi-bold'}>No Preview Available
                                </div>
                                <div className={'header-2 text-info font-weight-light'}>(Select a document to see preview)</div>
                            </div>
                    }
                </div>
            </div>
        </div>
    );
}

export default UserGuidePanelView;