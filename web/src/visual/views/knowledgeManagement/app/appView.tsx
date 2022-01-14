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
        const {className, currentSystemTool, docPreviewTool, permissions, ...rest} = this.props;

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
                        <div className={'d-flex flex-fill align-items-center justify-content-center'}>
                            <div className={'bg-info p-5'}>
                                <div className={'display-1 font-weight-bold p-5'}>Waiting for Approval</div>
                            </div>
                        </div>
                }
            </div>
        );
    }
}
