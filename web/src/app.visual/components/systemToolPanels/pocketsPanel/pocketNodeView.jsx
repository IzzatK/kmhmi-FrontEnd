import * as PropTypes from "prop-types";
import {Component} from "react";

export class PocketNodeView extends Component {

    render() {
        let {title, subTitle, actions} = this.props;
        return (
            <div className={"pocket-node d-flex flex-fill justify-content-between"}>
                <div className={"d-flex flex-column v-gap-2 justify-content-center align-items-center"}>
                    <div className={"title"}>{title ? title : ''}</div>
                    <div className={"sub-title"}>{subTitle ? subTitle : ''}</div>
                </div>
                <div className={'action-bar d-flex h-gap-3'}>
                    {actions}
                </div>
            </div>
        )
    }
}

PocketNodeView.propTypes = {
    title: PropTypes.any,
    subTitle: PropTypes.any,
    actions: PropTypes.any
}