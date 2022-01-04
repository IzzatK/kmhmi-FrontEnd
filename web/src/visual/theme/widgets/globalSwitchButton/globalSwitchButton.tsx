import React from "react";
import './globalSwitchButton.css';
import {PersonalSVG} from "../../svgs/personalSVG";
import {GlobalSVG} from "../../svgs/globalSVG";
import {ToggleButtonProps, ToggleButtonState} from "./globalSwitchButtonModel";

class GlobalSwitchButton extends React.Component<ToggleButtonProps, ToggleButtonState> {
    constructor(props:any) {
        super(props);
    }

    render() {
        const {className, onClick, isGlobal, light} = this.props;

        let cn = 'global-switch-button cursor-pointer';

        if (className) {
            cn += ` ${className}`;
        }

        if (light) {
            cn += ` light`;
        }

        if (isGlobal) {
            cn += ` global`;
        }

        return <div className={cn} onClick={onClick}>
            <div className={'d-flex h-gap-2'}>
                <PersonalSVG className={"personal-svg"}/>
                <GlobalSVG className={"global-svg"}/>
            </div>
        </div>;
    }
}

export default GlobalSwitchButton;
