import React, {Component} from "react";
import './comboBox.css';
import {ComboBoxItemProps, ComboBoxItemState} from "./comboBoxModel";
import CheckBox from "../checkBox/checkBox";

class ComboBoxItem extends Component<ComboBoxItemProps, ComboBoxItemState> {
    constructor(props: ComboBoxItemProps | Readonly<ComboBoxItemProps>) {
        super(props);
    }

    render() {
        const {className, title, selected, onClick, multiSelect} = this.props;

        let cn = "list-cell header-3 h-gap-2";
        if (className) {
            cn += ` ${className}`;
        }

        if (selected) {
            cn += ` selected`;
        }

        return (
            <div className={cn} onClick={onClick}>
                {
                    multiSelect &&
                    <CheckBox selected={selected}/>
                }
                <div className={'text-wrap title'}>{title}</div>
            </div>
        );
    }
}

export default ComboBoxItem;
