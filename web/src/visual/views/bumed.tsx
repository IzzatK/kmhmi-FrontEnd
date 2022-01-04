import React, { Component } from 'react';
import "./bumed.css";
// import Login from "./landing/landing";
import {App} from "./app/App";
import {SystemBannerPresenter} from "../components/systemBanner/systemBannerPresenter";

class Bumed extends Component {

    render() {
       return (
           <div id={"bumed"} className={"h-100 d-flex flex-column header-3"} style={{background: 'var(--app-background)'}}>
               <SystemBannerPresenter/>
               <div className={"view-container flex-fill position-relative"}>
                   <App/>
               </div>
           </div>
       )
    }
}


export default Bumed;
