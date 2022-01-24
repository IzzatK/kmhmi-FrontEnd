import React, { Component } from 'react';
import "./knowledgeManagement.css";
import {AppPresenter} from "./app/appPresenter";
import {SystemBannerPresenter} from "../../components/systemBanner/systemBannerPresenter";
import { LandingPresenter } from './landing/landingPresenter';
import {KnowledgeManagementProps} from "./knowledgeManagementModel";




class KnowledgeManagementView extends Component<KnowledgeManagementProps> {


    componentDidMount() {

        let cookie = this.getCookie('KEYCLOAK_SESSION');
        console.log(cookie);
    }

    getCookie(key: string) {
        const name = key + '=';
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return '';
    };

    render() {

        const { isAuthenticated } = this.props;

       return (
           <div id={"knowledge-management"} className={"h-100 d-flex flex-column header-3"} style={{background: 'var(--app-background)'}}>
               <SystemBannerPresenter/>
               <div className={"view-container flex-fill position-relative"}>
                   {
                       isAuthenticated ?
                       <AppPresenter/>  :
                       <LandingPresenter/>
                   }
               </div>
           </div>
       )
    }
}


export default KnowledgeManagementView;
