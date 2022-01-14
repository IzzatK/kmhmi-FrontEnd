import React, {Component} from "react";
import './button.css';
import {TooltipPortal} from "../tooltipPortal/tooltipPortal";
import {ButtonProps, ButtonState, Justify_Content} from "./buttonModel";

class Button extends Component<ButtonProps, ButtonState> {

    render() {

        const {
            className,
            selected,
            disabled,
            text,
            onClick,
            orientation,
            children,
            justifyContent = Justify_Content['justify_content_center'],
            tooltip,
            light,
            highlight,
        } = this.props;

        let cn = 'button user-select-none d-flex align-items-center rounded h-gap-2 p-2 header-3';

        if (className) {
            cn += ` ${className}`;
        }

        if (light) {
            cn += ` light`;
        }

        if (highlight) {
            cn += ` highlight`;
        }

        if (justifyContent) {
            cn += ` ${justifyContent}`
        }

        if (orientation === 'vertical') {
            cn += ` flex-column`;
        }

        if (selected) {
            cn += ` selected`;
        }

        if (disabled) {
            cn += ` disabled`;
        }

        const buttonDiv = (
            <div className={cn} onClick={!disabled ? onClick : undefined}>
                {children && children}
                {text && <div>{text}</div>}
            </div>
        );

        return (
            tooltip ?
                (
                    <TooltipPortal portalContent={
                        tooltip &&
                        <div>{tooltip}</div>
                    }>
                        {buttonDiv}
                    </TooltipPortal>
                )
                :
                buttonDiv
        );
    }
}

export default Button;
