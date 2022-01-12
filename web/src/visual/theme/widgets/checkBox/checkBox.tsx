import React, {Component} from 'react';
import './checkBox.css';
import {CheckProp, CheckState} from "./checkBoxModel";
import {CheckMarkSVG} from "../../svgs/checkMarkSVG";

class CheckBox extends Component<CheckProp, CheckState> {
    constructor(props: any) {
        super(props);

        this.state = {
            selected: this.props.selected ? this.props.selected : false,
        }
    }

    toggleHandler = () => {
        const { disabled, onClick } = this.props;
        const { selected } = this.state;

        if (!disabled) {
            this.setState({
                ...this.state,
                selected: !selected}, () => {
                if (onClick) {
                    onClick(this.state.selected);
                }
                });

        }
    };

    componentDidUpdate(prevProps: Readonly<CheckProp>, prevState: Readonly<CheckState>, snapshot?: any) {
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

    render() {
        const {className, onClick, disabled, text, ...rest} = this.props;
        const { selected } = this.state;

        let cn = "check-box";
        if (className) {
            cn += ` ${className}`;
        }
        if (selected) {
            cn += ` selected`;
        }
        if (disabled) {
            cn += ` disabled`;
        }

        return (
            <div className={cn} {...rest} onClick={this.toggleHandler}>
                <label>
                    <input type={"checkbox"} checked={selected} onChange={this.toggleHandler}/>
                </label>
                <CheckMarkSVG className="small-image-container checkmark"/>
            </div>
        );
    }
}


export default CheckBox;
