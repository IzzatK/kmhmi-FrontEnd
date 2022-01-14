import React, {Component} from "react";
import {Props, State} from "./appModel";
import {SearchViewPresenter} from "./search/searchView";
import {DocumentPanelPresenter} from "../../../components/documentPanel/documentPanelPresenter";
import {UploadPanelPresenter} from "../../../components/systemToolPanels/uploadPanel/uploadPanelPresenter";
import {ProfilePanelPresenter} from "../../../components/systemToolPanels/profilePanel/profilePanelPresenter";
import {TagsPanelPresenter} from "../../../components/systemToolPanels/tagsPanel/tagsPanelPresenter";
import {StatsPanelPresenter} from "../../../components/systemToolPanels/statsPanel/statsPanelPresenter";
import {SystemToolbarPresenter} from "../../../components/systemToolbar/systemToolbarPresenter";
import {referenceService, statService, tagService} from "../../../../application/serviceComposition";
import {forEachKVP} from "../../../../framework.visual/extras/utils/collectionUtils";
import {ReferenceType} from "../../../../model";
import Button from "../../../theme/widgets/button/button";

export class AppView extends Component<Props, State> {
    private interval!: NodeJS.Timer;


    componentDidMount() {
        this.interval = setInterval(() => {
            this.fetchData();
        }, 300000); // 5 minutes
        this.fetchData();
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    fetchData() {
        statService.fetchStats();
        tagService.fetchTags();
        forEachKVP(ReferenceType, (key: any, value: ReferenceType) => {
            referenceService.fetchReferences(value);
        });
    }

    render() {
        const {className, currentSystemTool, docPreviewTool, permissions, admin, ...rest} = this.props;

        const {visible: docVisible} = docPreviewTool || {};

        let cn = `${className ? className : ''} d-flex h-100`;

        return (
            <div id={'analysis'} {...rest} className={cn}>
                {
                    permissions.canSearch &&
                        <React.Fragment>
                            <SearchViewPresenter className={"flex-fill flex-basis-0"} style={{zIndex: '1'}}/>
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
                {
                    !permissions.canSearch &&
                    <div className={"auth-pending d-flex flex-fill justify-content-center align-items-center"}>
                        <div className={"d-flex flex-column popup v-gap-5"}>
                            <div className={"text-selected font-weight-semi-bold px-5 pt-5"}>
                                <div className={"d-flex justify-content-center mt-5 pt-5"}>Your Authorization is Pending...</div>
                            </div>

                            <div className={"d-flex flex-column justify-content-center align-items-center v-gap-5 px-5 mx-5"}>
                                {
                                    admin &&
                                    <div className={"d-flex flex-column justify-content-center align-items-center v-gap-5"}>
                                        <div className={"text-info font-weight-light display-3 pt-5"}>The following admin needs to authorize you in order to access CIC Knowledge Management</div>
                                        <div className={"d-flex admin header-2 h-gap-5 pt-5"}>
                                            <div>{admin.name}</div>
                                            <div className={"d-flex h-gap-2"}>
                                                <div>PHONE</div>
                                                <div>{admin.phone}</div>
                                            </div>
                                            <div className={"d-flex h-gap-2"}>
                                                <div>EMAIL</div>
                                                <div>{admin.email}</div>
                                            </div>
                                        </div>
                                    </div>
                                }
                                <div className={"text-info font-weight-light display-3 pt-5"}>Please check back once your authorization has been approved.</div>
                            </div>

                            <div className={"d-flex justify-content-end py-4 pr-5 bg-advisory"}/>
                        </div>
                    </div>

                        // <div className={'d-flex flex-fill align-items-center justify-content-center'}>
                        //     <div className={'bg-info p-5'}>
                        //         <div className={'display-1 font-weight-bold p-5'}>Waiting for Approval</div>
                        //     </div>
                        // </div>
                }
            </div>
        );
    }
}
