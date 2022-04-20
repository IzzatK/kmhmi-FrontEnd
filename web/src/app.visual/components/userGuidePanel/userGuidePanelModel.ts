import {UserProfileVM} from "../documentPanel/documentPanelModel";

export type UserGuidePanelStateProps = {
    className?: string;
    helpDocument: UserGuideInfoVM;
    userProfile: UserProfileVM;
    token: string;
}

export type UserGuidePanelDispatchProps = {

}

export type UserGuidePanelPresenterProps = UserGuidePanelStateProps & UserGuidePanelDispatchProps;

export type UserGuidePanelPresenterState = {

}

export type UserGuidePanelViewProps = {
    className?: string;
    helpDocument: UserGuideInfoVM;
    userProfile: UserProfileVM;
    token: string;
}

export type HelpPdfPreviewProps = {
    className?: string;
    preview_url: string;
    userProfile: UserProfileVM;
    token: string;
    zoomScale: number;
    onZoom: (zoomScale: number) => void;
}

export type UserGuideInfoVM = {
    preview_url?: string;
}