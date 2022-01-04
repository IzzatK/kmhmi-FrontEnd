import React from "react";
import './card.css';
import {CardProps, CardState} from "./cardModel";

class Card extends React.Component<CardProps, CardState> {

    constructor(props: CardProps) {
        super(props);
        this.state = {
            expanded: false,
        }
    }

    componentDidMount() {
        if (this.props.selected !== undefined) {
            this.setState({expanded: this.props.selected});
        }
    }

    _toggleExpanded() {
        if (this.props.body || this.props.children) {
            this.setState({expanded: !this.state.expanded});
        }

        if (this.props.onClick) {
            this.props.onClick();
        }
    }

    render() {
        const {className, header, body, children, onClick, ...rest} = this.props;
        const {expanded} = this.state;

        let cn = "card d-flex";
        if (className) {
            cn += ` ${className}`;
        }

        if (expanded) {
            cn += ` selected`;
        }

        return (
            <div className={cn} {...rest}>
                <div onClick={() => this._toggleExpanded()} className={"cursor-pointer card-header w-100"}>{header}</div>
                <div className={`card-body ${this.state.expanded ? 'expanded': 'collapsed'}`}>
                    <React.Fragment>
                        {body}
                        {children}
                    </React.Fragment>
                </div>
            </div>
        );
    }
}

export default Card;
