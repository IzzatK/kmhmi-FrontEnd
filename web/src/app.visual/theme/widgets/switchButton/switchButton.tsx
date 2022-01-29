import React from "react";
import './switchButton.css';
import {SwitchButtonProps, SwitchButtonState} from "./switchButtonModel";

class SwitchButton extends React.Component<SwitchButtonProps, SwitchButtonState> {
    constructor(props: any) {
        super(props);
        this.state = {
            selected: false,
        }
    }

    componentDidUpdate(prevProps: Readonly<SwitchButtonProps>, prevState: Readonly<SwitchButtonState>, snapshot?: any) {
        const { selected } = this.props;
        if (prevProps.selected !== selected) {
            this.setSelected(selected);
        }
    }

    setSelected(selected: boolean | undefined) {
        this.setState({
            ...this.state,
            selected
        })
    }

    toggleHandler = () => {
        const { onClick } = this.props;
        const { selected } = this.state;

        this.setState({
            ...this.state,
            selected: !selected});
        if (onClick) {
            onClick();
        }
    };

    render() {
        const {className, onClick, selected, text, ...rest} = this.props;

        let cn = "switch-button shadow-sm d-flex position-relative d-inline-block";
        if (className) {
            cn += ` ${className}`;
        }

        return (
            <label className={cn} {...rest} onClick={onClick}>{text}
                <input type={"checkbox"} checked={selected} onClick={this.toggleHandler}/>
                <span className={"thumb"}/>
            </label>
        );
    }
}

export default SwitchButton;
