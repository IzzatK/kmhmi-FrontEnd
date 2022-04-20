import {UserGuidePanelViewProps} from "../userGuidePanelModel";
import React from "react";
import {LoadingIndicator} from "../../../theme/widgets/loadingIndicator/loadingIndicator";
import HelpPdfPreview from "../helpPdfPreview";

function UserGuidePanelView(props: UserGuidePanelViewProps) {
    const {
        helpDocument,
        userProfile,
        token,
        className,
    } = props;

    const {
        preview_url = "",
    } = helpDocument || {};

    let cn = "document-panel d-flex"

    if (className) {
        cn += ` ${className}`;
    }

    // TODO: model this after documentPanelView
    let zoomScale = 1;
    let _onZoom = () => {
        console.log("onZoom");
    }

    return (
        <div className={cn}>
            <div className={'d-flex flex-fill flex-column align-items-stretch h-100'}>
                <div className={"body flex-fill d-flex align-self-stretch position-relative"}>
                    {
                        preview_url.length > 0 ?
                            <HelpPdfPreview
                                preview_url={preview_url}
                                userProfile={userProfile}
                                token={token}
                                zoomScale={zoomScale}
                                onZoom={_onZoom}
                            />
                            :
                            <div className={"position-relative w-100 h-100"}>
                                 <LoadingIndicator/>
                            </div>
                    }
                </div>
            </div>
        </div>
    );
}

export default UserGuidePanelView;