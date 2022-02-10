import React, { Component } from 'react';
import "./knowledgeManagement.css";
import {AppPresenter} from "./app/appPresenter";
import {SystemBannerPresenter} from "../../components/systemBanner/systemBannerPresenter";
import { LoginPresenter } from './login/loginPresenter';
import {KnowledgeManagementProps, KnowledgeManagementState} from "./knowledgeManagementModel";
import {LoadingIndicator} from "../../theme/widgets/loadingIndicator/loadingIndicator";
import {Size} from "../../theme/widgets/loadingIndicator/loadingIndicatorModel";




export default class KnowledgeManagementView extends Component<KnowledgeManagementProps, KnowledgeManagementState> {
    render() {
        const { isAuthenticated, isAuthenticating } = this.props;

        return (
            <div id={"knowledge-management"} className={"h-100 d-flex flex-column header-3"} style={{background: 'var(--app-background)'}}>
                <SystemBannerPresenter/>

                <div className={"view-container flex-fill position-relative"}>
                    {
                        isAuthenticating ?
                            <LoadingIndicator size={Size.large}/> :
                            isAuthenticated ?
                                <AppPresenter/>  :
                                <LoginPresenter/>
                    }
                </div>
            </div>
        )
    }
}
