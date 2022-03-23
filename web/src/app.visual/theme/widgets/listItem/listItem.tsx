import './listItem.css';
import {ListItemProps, ListItemState} from './listSystemModel';
import React, {Component} from "react";


class ListItem extends Component<ListItemProps, ListItemState> {
    render() {
        const {className, children, onClick, selected, ...rest} = this.props;

        let cn = "list-item d-flex";
        if (className) {
            cn += ` ${className}`;
        }

        if (selected) {
            cn += ` selected`;
        }

        return (
            <div className={cn} {...rest} onClick={onClick}>
                {children}
            </div>
        )
    }
}

export default ListItem;
