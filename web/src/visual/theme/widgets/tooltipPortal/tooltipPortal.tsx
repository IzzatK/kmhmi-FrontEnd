import ReactTooltip from "react-tooltip";
import React from "react";
import Button from "../button/button";
import Portal from "../portal/portal";
import {bindInstanceMethods} from "../../../../framework/extras/typeUtils";

import {TooltipPortalProps, TooltipPortalState} from './tooltipPortalModel';


export class TooltipPortal extends  React.Component<TooltipPortalProps, TooltipPortalState> {

    constructor(props: TooltipPortalProps, context: any) {
        super(props, context);

        bindInstanceMethods(this);

        this.state = {
            willShow: false,
            isShowing: false,
        }
    }

    _onMouseLeave() {
        this.setState({
            ...this.state,
            willShow: false,
            isShowing: false
        })
    }

    _onMouseEnter() {
        this.setState({
            ...this.state,
            willShow: true
        })

        setTimeout(() => {
            if (this.state.willShow) {
                this.setState({
                    ...this.state,
                    isShowing: true
                })
            }
        }, 500);
    }

    render() {
        const { portalContent, children, ...rest } = this.props;

        const { isShowing } = this.state;

        return (
            <div {...rest} onMouseEnter={this._onMouseEnter} onMouseLeave={this._onMouseLeave}>
                <Portal
                    isOpen={isShowing}
                    portalContent={portalContent}>
                    {children}
                </Portal>
            </div>

        )
    }
}
