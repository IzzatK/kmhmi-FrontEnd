import React, {Component} from "react";
import {Props, State, StateProps} from "./appModel";
import {SearchPresenter} from "./search/searchPresenter";
import {DocumentPanelPresenter} from "../../../components/documentPanel/documentPanelPresenter";
import {UploadPanelPresenter} from "../../../components/systemToolPanels/uploadPanel/uploadPanelPresenter";
import {ProfilePanelPresenter} from "../../../components/systemToolPanels/profilePanel/profilePanelPresenter";
import {TagsPanelPresenter} from "../../../components/systemToolPanels/tagsPanel/tagsPanelPresenter";
import {StatsPanelPresenter} from "../../../components/systemToolPanels/statsPanel/statsPanelPresenter";
import {SystemToolbarPresenter} from "../../../components/systemToolbar/systemToolbarPresenter";
import {referenceService, statService, tagService} from "../../../../app.core/serviceComposition";
import {forEachKVP} from "../../../../framework.visual/extras/utils/collectionUtils";
import {ReferenceType} from "../../../../app.model";
import {LandingPanelPresenter} from "../../../components/landingPanel/landingPanelPresenter";
import {LoadingIndicator} from "../../../theme/widgets/loadingIndicator/loadingIndicator";
import {Size} from "../../../theme/widgets/loadingIndicator/loadingIndicatorModel";

export class AppView extends Component<Props, State> {
    private interval!: NodeJS.Timer;

    constructor(props: StateProps | Readonly<StateProps>) {
        super(props);
    }

    componentDidMount() {
        this.interval = setInterval(() => {
            this.fetchData();
        }, 300000); // 5 minutes
        this.fetchData();
    }


    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any) {
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
            //
            // setTimeout(() => {
            //     referenceService.fetchReferences(ReferenceType.ROLE);
            // }, 1000)
        }
    }

    render() {
        const {className, currentSystemTool, isDocumentVisible, permissions, isAuthorized, isAuthorizing, ...rest} = this.props;


        let cn = `${className ? className : ''} d-flex h-100`;

        return (
            <div id={'analysis'} {...rest} className={cn}>
                {
                    // show loading indicator when fetching user status
                    isAuthorizing ?
                    <LoadingIndicator size={Size.large}/> :
                        !isAuthorized ?
                            // is user status not authorized, then show landing page
                            <LandingPanelPresenter/> :
                            <React.Fragment>
                                {
                                    permissions.canSearch ?
                                        <SearchPresenter className={"d-flex flex-fill flex-basis-0"} style={{zIndex: '1'}}/>
                                        :
                                        <div className={"d-flex flex-fill align-items-center justify-content-center"}>
                                            <div className={'display-1 text-secondary'}>You do not have search permissions
                                            </div>
                                        </div>
                                }

                                <div className={isDocumentVisible ? "view-container system-tools-panel flex-fill flex-basis-0 position-relative slideRightIn-active" : 'view-container slideRightOut-active'}>
                                    <DocumentPanelPresenter className={isDocumentVisible ? 'flex-fill flex-basis-0' : ''}
                                                            style={{zIndex: '9999'}}/>
                                </div>
                                <div className={currentSystemTool ? "view-container system-tools-panel flex-fill flex-basis-0 position-relative slideRightIn-active" : 'view-container slideRightOut-active'}>
                                    <UploadPanelPresenter/>
                                    <ProfilePanelPresenter/>
                                    <TagsPanelPresenter/>
                                    <StatsPanelPresenter/>
                                </div>
                                <SystemToolbarPresenter style={{zIndex: '1'}}/>
                            </React.Fragment>
                }
            </div>
        );
    }
}
