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
import {LoadingIndicator} from "../../../theme/widgets/loadingIndicator/loadingIndicator";
import {Size} from "../../../theme/widgets/loadingIndicator/loadingIndicatorModel";
import {RegistrationStatusType} from "../../../model/registrationStatusType";
import { LandingPanelPresenter } from "../../../components/landingPanel/landingPanelPresenter";

export class AppView extends Component<Props, State> {
    private interval!: NodeJS.Timer;
    private timeout!: NodeJS.Timeout;

    constructor(props: StateProps | Readonly<StateProps>) {
        super(props);

        this.state = {
            loading: true,
        }
    }

    componentDidMount() {
        this.interval = setInterval(() => {
            this.fetchData();
        }, 300000); // 5 minutes
        this.fetchData();

        this.timeout = setTimeout(() => {
            this.setLoading(false);
        }, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
        clearTimeout(this.timeout);
    }

    fetchData() {
        if (this.props.permissions.canSearch) {
            statService.fetchStats();
            tagService.fetchTags();
            forEachKVP(ReferenceType, (key: any, value: ReferenceType) => {
                referenceService.fetchReferences(value);
            });
        }
    }

    setLoading(value: boolean) {
        this.setState({
            ...this.state,
            loading: value
        })
    }

    render() {
        const {className, currentSystemTool, docPreviewTool, permissions, admin, registrationStatus, hasAccess, ...rest} = this.props;

        const {visible: docVisible} = docPreviewTool || {};

        let cn = `${className ? className : ''} d-flex h-100`;

        return (
            <div id={'analysis'} {...rest} className={cn}>
                {
                    !hasAccess &&
                    <LandingPanelPresenter/>
                }
                {
                    hasAccess &&
                    <React.Fragment>
                        {
                            permissions.canSearch ?
                                <SearchPresenter className={"flex-fill flex-basis-0"} style={{zIndex: '1'}}/>
                                // <SearchWrapper/>
                                :
                                <div className={"d-flex flex-fil align-items-center justify-content-center"}>
                                   <div className={'display-1 text-secondary'}>You do not have search permissions</div>
                                </div>

                        }

                        <div className={docVisible ? "view-container system-tools-panel flex-fill flex-basis-0 position-relative slideRightIn-active" : 'view-container slideRightOut-active'}>
                            <DocumentPanelPresenter className={docVisible ? 'flex-fill flex-basis-0' : ''}
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
