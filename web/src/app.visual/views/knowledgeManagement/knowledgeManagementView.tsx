import React, { Component } from 'react';
import "./knowledgeManagement.css";
import {AppPresenter} from "./app/appPresenter";
import {SystemBannerPresenter} from "../../components/systemBanner/systemBannerPresenter";
import { LoginPresenter } from './login/loginPresenter';
import {KnowledgeManagementProps} from "./knowledgeManagementModel";




export default class KnowledgeManagementView extends Component<KnowledgeManagementProps> {

    render() {
        const { isAuthenticated } = this.props;

        return (
            <div id={"knowledge-management"} className={"h-100 d-flex flex-column header-3"} style={{background: 'var(--app-background)'}}>
                <SystemBannerPresenter/>
                <div className={"view-container flex-fill position-relative"}>
                    {
                        isAuthenticated ?
                            <AppPresenter/>  :
                            <LoginPresenter/>
                    }
                </div>
            </div>
        )
    }
}
