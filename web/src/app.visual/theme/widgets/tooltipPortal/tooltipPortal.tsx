import React from "react";
import Portal from "../portal/portal";
import {bindInstanceMethods} from "../../../../framework.core/extras/utils/typeUtils";
import {TooltipPortalProps, TooltipPortalState, TooltipPosition} from './tooltipPortalModel';
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
        const { className, portalContent, children, light, position=TooltipPosition.BOTTOM, isButton, ...rest } = this.props;

        const { isShowing } = this.state;

        let cn = "tooltip-portal shadow-lg p-4 header-3";

        if (className) {
            cn += ` ${className}`;
        }

        if (isButton) {
            cn += `d-flex text-nowrap justify-content-center header-3`
        } else {
            cn += `text-wrap`
        }


        if (light) {
            cn += ` light`;
        }

        switch (position) {
            case TooltipPosition.TOP:
                cn += ` top`;
                break;
            case TooltipPosition.LEFT:
                cn += ` left`;
                break;
            case TooltipPosition.RIGHT:
                cn += ` right`;
                break;
            case TooltipPosition.BOTTOM:
            default:
                cn += ` bottom`;
                break;
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
