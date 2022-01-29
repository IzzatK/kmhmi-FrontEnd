import React, {Component} from 'react';
import './systemBanner.css';
import Button from "../../theme/widgets/button/button";
import {bindInstanceMethods} from "../../../framework/extras/typeUtils";
import {SystemBannerProps, SystemBannerState} from "./systemBannerModel";

class SystemBannerView extends Component<SystemBannerProps, SystemBannerState> {


    constructor(props: any, context: any) {
        super(props, context);

        bindInstanceMethods(this);
    }

    _onReturnHome() {
        const { onReturnHome } = this.props;

        if (onReturnHome) {
            onReturnHome();
        }
    }

    _onLogout() {
        const { onLogout } = this.props;

        if (onLogout) {
            onLogout();
        }
    }

    render() {
        const {className, onLogout, userName, onReturnHome, ...rest} = this.props;

        let cn = 'system-banner d-flex p-3';
        if (className) {
            cn += ` ${className}`;
        }

        return (
            <div className={cn} {...rest}>
                <div className={"d-flex flex-fill flex-basis-0 align-items-center h-gap-3"}>
                    <Button className={"btn-transparent"} onClick={this._onReturnHome}>
                        <div className={"bumed-logo"}/>
                    </Button>
                    <div className={"display-1 title font-weight-bold"}>CIC</div>
                    <div className={"header-1 pt-1 font-weight-semi-bold text-nowrap text"}>Consolidated Information Center</div>
                    <div className={"header-1 pt-1 text-nowrap text"}>|</div>
                    <div className={"header-1 system-banner-text-accent pt-1 text-nowrap"}>Knowledge Management</div>
                </div>
                <div className={"flex-fill flex-basis-0"}/>
                <div className={"d-flex flex-fill flex-shrink-0 align-self-stretch justify-content-end"}>
                    <div className={`d-flex align-items-center h-gap-5`}>
                        <Button>{userName}</Button>
                        <Button onClick={this._onLogout}>Logout</Button>
                    </div>
                </div>
            </div>
        );
    }
}

export default SystemBannerView;