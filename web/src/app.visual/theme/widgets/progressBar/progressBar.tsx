import React, {Component} from 'react';
import './progressBar.css';
import {clamp} from "../../../../framework.core/extras/utils/mathUtils";
import {ProgressBarProps, ProgressBarState} from "./progressBarModel";
import {bindInstanceMethods} from "../../../../framework.core/extras/utils/typeUtils";


class ProgressBar extends Component<ProgressBarProps, ProgressBarState> {
    constructor(props: ProgressBarProps | Readonly<ProgressBarProps>) {
        super(props);

        bindInstanceMethods(this);
    }
    render () {
        const { percent, className, level, ...rest } = this.props;


        let clampedPercent = clamp(percent, 0, 100);
        let levelcolor = "var(--charged-background)";
        if(level === "nominal") levelcolor = "var(--charged-nominal-background)";
        else if(level === "warning") levelcolor = "var(--charged-warning-background)";
        else if(level === "critical") levelcolor = "var(--charged-critical-background)";
        const chargedStyle = {
            width: clampedPercent + '%',
            background: levelcolor,
        };

        let cn = "progress-bar";
        if (className) {
            cn += ` ${className}`;
        }

        return (
            <div className={cn} {...rest}>
                <div className={"bar"} style={chargedStyle}/>
            </div>
        );
    }
}

export default ProgressBar;
