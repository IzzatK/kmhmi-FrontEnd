import React, {Component} from "react";
import {AppState, Props, State, StateProps} from "./appModel";
import {SearchPresenter} from "./search/searchPresenter";
import {DocumentPanelPresenter} from "../../../components/documentPanel/documentPanelPresenter";
import {UploadPanelPresenter} from "../../../components/uploadPanel/uploadPanelPresenter";
import {ProfilePanelPresenter} from "../../../components/profilePanel/profilePanelPresenter";
import {TagsPanelWrapper} from "../../../components/tagsPanel/tagsPanelWrapper";
import {StatsPanelPresenter} from "../../../components/statsPanel/statsPanelPresenter";
import {PocketsPanelPresenter} from "../../../components/pocketsPanel/pocketsPanelPresenter";
import {SystemToolbarPresenter} from "../../../components/systemToolbar/systemToolbarPresenter";
import {pocketService, referenceService, statService, tagService} from "../../../../serviceComposition";
import {ReferenceType} from "../../../../app.model";
import {LandingPanelPresenter} from "../../../components/landingPanel/landingPanelPresenter";
import {LoadingIndicator} from "../../../theme/widgets/loadingIndicator/loadingIndicator";
import {Size} from "../../../theme/widgets/loadingIndicator/loadingIndicatorModel";
import {ReportPanelWrapper} from "../../../components/reportPanel/reportPanelWrapper";

export class AppView extends Component<Props, AppState> {
    private interval!: NodeJS.Timer;

    constructor(props: StateProps | Readonly<StateProps>) {
        super(props);

        this.state = {
            isMouseDown: false,
            mousePosition: 0,
            documentPreviewPanelWidth: 'w-33',
            movementDirection: 0,
            showPreview: false,
        }
    }

    componentDidMount() {
        this.interval = setInterval(() => {
            this.fetchData();
        }, 300000); // 5 minutes
        this.fetchData();
    }

    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<AppState>, snapshot?: any) {
        if (!prevProps.permissions.canSearch && this.props.permissions.canSearch) {
            this.fetchData();
        }
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    fetchData() {
        if (this.props.permissions.canSearch) {
            statService.fetchStats();
            tagService.fetchTags();
            // forEachKVP(ReferenceType, (key: any, value: ReferenceType) => {
            //     referenceService.fetchReferences(value);
            // });

            referenceService.fetchReferences(ReferenceType.DEPARTMENT);
            referenceService.fetchReferences(ReferenceType.PURPOSE);
            referenceService.fetchReferences(ReferenceType.ROLE);
            // referenceService.fetchReferences(ReferenceType.STATUS);

            pocketService.fetchPockets();
        }
    }

    _onMouseDown(event: React.MouseEvent<HTMLDivElement>) {
        this.setState({
            ...this.state,
            isMouseDown: true,
            mousePosition: event.clientX,
        })
    }

    _onMouseLeave(event: React.MouseEvent<HTMLDivElement>) {
        const { mousePosition, isMouseDown, documentPreviewPanelWidth } = this.state;

        if (isMouseDown) {
            let movementDirection = 1;
            if (event.clientX < mousePosition) {
                movementDirection = -1;
            }

            let showPreview = false;
            if (documentPreviewPanelWidth === 'w-33' && movementDirection === -1) {
                showPreview = true;
            } else if (documentPreviewPanelWidth === 'w-67' && movementDirection === 1) {
                showPreview = true;
            }

            this.setState({
                ...this.state,
                movementDirection,
                showPreview,
            })
        }
    }

    _onMouseUp(event: React.MouseEvent<HTMLDivElement>) {
        const { documentPreviewPanelWidth, movementDirection, isMouseDown } = this.state;

        if (isMouseDown) {
            if (documentPreviewPanelWidth === 'w-33' && movementDirection === -1) {
                this.setState({
                    ...this.state,
                    isMouseDown: false,
                    documentPreviewPanelWidth: 'w-67',
                    showPreview: false,
                })
            } else if (documentPreviewPanelWidth === 'w-67' && movementDirection === 1) {
                this.setState({
                    ...this.state,
                    isMouseDown: false,
                    documentPreviewPanelWidth: 'w-33',
                    showPreview: false,
                })
            }
        }

    }

    render() {
        const {className, currentSystemTool, isDocumentVisible, isReportVisible, permissions, isAuthorized, isAuthorizing, ...rest} = this.props;
        const { documentPreviewPanelWidth, showPreview } = this.state;

        let cn = `${className ? className : ''} d-flex h-100`;

        let searchPanelWidth = 'w-33';
        if (documentPreviewPanelWidth === 'w-33') {
            searchPanelWidth = 'w-67';
        }

        return (
            <div id={'analysis'} {...rest} className={cn} onMouseUp={(e) => this._onMouseUp(e)}>
                {
                    // show loading indicator when fetching user status
                    isAuthorizing ?
                    <LoadingIndicator size={Size.large}/> :
                        !isAuthorized ?
                            // is user status not authorized, then show landing page
                            <LandingPanelPresenter/> :
                            <React.Fragment>
                                <SystemToolbarPresenter style={{zIndex: '1'}}/>

                                <div className={'d-flex w-100 h-100 position-relative'}>
                                    <div className={currentSystemTool ? `view-container system-tools-panel flex-fill slideLeftIn-active ${searchPanelWidth}` : 'view-container slideLeftOut-active'}>
                                        <UploadPanelPresenter/>
                                        <ProfilePanelPresenter/>
                                        <TagsPanelWrapper/>
                                        <StatsPanelPresenter/>
                                        <PocketsPanelPresenter/>
                                        <SearchPresenter permissions={permissions} className={"d-flex flex-fill flex-basis-0"} style={{zIndex: '1'}}/>
                                    </div>

                                    <div className={(isDocumentVisible || isReportVisible) ? `view-container system-tools-panel flex-fill slideRightIn-active position-relative ${documentPreviewPanelWidth}` : 'view-container slideRightOut-active'}>
                                        {
                                            (isDocumentVisible || isReportVisible) &&
                                            <div className={"position-absolute h-100"} style={{cursor: 'e-resize', width: '1rem', left: 0, top: 0, zIndex: '10'}} onMouseDown={(e) => this._onMouseDown(e)} onMouseLeave={(e) => this._onMouseLeave(e)}/>
                                        }
                                        <DocumentPanelPresenter className={'flex-fill'} style={{zIndex: '9'}}/>
                                        <ReportPanelWrapper className={'flex-fill'} style={{zIndex: '9'}}/>
                                    </div>

                                    {
                                        showPreview &&
                                        <div className={`drag-preview position-absolute h-100 ${searchPanelWidth}`}/>
                                    }
                                </div>

                            </React.Fragment>
                }
            </div>
        );
    }
}
