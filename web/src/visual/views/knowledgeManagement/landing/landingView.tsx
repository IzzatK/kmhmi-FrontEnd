import React, {Component} from "react";
import {LandingProps, LandingState} from "./landingModel";
import {LandingPanelPresenter} from "../../../components/landingPanel/landingPanelPresenter";

export class LandingView extends Component<LandingProps, LandingState> {
    render() {
        const { className, ...rest } = this.props;

        let cn = `${className ? className : ''} d-flex flex h-100`;

        return (
            <div id={'landing'} {...rest} className={cn}>
                <LandingPanelPresenter/>
            </div>
        );
    }
}
