import './listItem.css';
import {ListItemProps} from './listSystemModel';
import React from "react";


class ListItem extends React.Component<ListItemProps> {
    render() {
        const {className, children, onClick, selected, ...rest} = this.props;

        let cn = "listItem d-flex";
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
