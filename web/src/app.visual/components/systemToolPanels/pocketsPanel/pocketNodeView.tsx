import {Component} from "react";
import {PocketNodeProps, PocketNodeState} from "./pocketsPanelModel";
import {bindInstanceMethods} from "../../../../framework.core/extras/typeUtils";

export class PocketNodeView extends Component<PocketNodeProps, PocketNodeState> {
    constructor(props: any) {
        super(props);

        bindInstanceMethods(this);

        this.state = {
            selected: false,
        }
    }

    //TODO store selected nodes here as state  - should attach selected prop to data - need to add selectionContext for reports and pockets?

    _setSelected(selected: boolean) {
        this.setState({
            ...this.state,
            selected: selected,
        })
    }


    componentDidUpdate(prevProps: Readonly<PocketNodeProps>, prevState: Readonly<PocketNodeState>, snapshot?: any) {
        if (this.props.selected != null) {
            if (this.props.selected != this.state.selected) {
                this._setSelected(this.props.selected);
            }
        }
    }

    _toggleSelected() {
        const { selected } = this.state;

        const nextSelected = !selected;

        this._setSelected(nextSelected);

        if (this.props.onSelect != null) {
            this.props.onSelect(this.props.path, nextSelected);
        }
    }

    render() {
        const {className, title, subTitle, actions} = this.props;
        const { selected } = this.state;

        let cn = "pocket-node d-flex flex-fill justify-content-between";

        if (className) {
            cn += ` ${className}`;
        }
        if (selected) {
            cn += ` selected`
        }

        return (
            <div onClick={this._toggleSelected} className={cn}>
                <div className={"d-flex flex-row v-gap-2 justify-content-center align-items-center"}>
                    <div className={"node-title"}>{title ? title : ''}</div>
                    <div className={"node-sub-title"}>{subTitle ? subTitle : ''}</div>
                </div>
                <div className={'action-bar d-flex h-gap-3'}>
                    {actions}
                </div>
            </div>
        )
    }
}
