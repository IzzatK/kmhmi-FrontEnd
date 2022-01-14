import React from "react";
import Portal from "../portal/portal";
import {bindInstanceMethods} from "../../../../framework/extras/typeUtils";
import {TooltipPortalProps, TooltipPortalState} from './tooltipPortalModel';
import './tooltipPortal.css';

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
        const { className, portalContent, children, ...rest } = this.props;

        const { isShowing } = this.state;

        let cn = "tooltip-portal bg-primary shadow-lg text-wrap p-4 header-3 text-selected";

        if (className) {
            cn += ` ${className}`;
        }

        return (
            <div {...rest} onMouseEnter={this._onMouseEnter} onMouseLeave={this._onMouseLeave}>
                <Portal
                    className={cn}
                    isOpen={isShowing}
                    portalContent={portalContent}>
                    {children}
                </Portal>
            </div>

        )
    }
}
