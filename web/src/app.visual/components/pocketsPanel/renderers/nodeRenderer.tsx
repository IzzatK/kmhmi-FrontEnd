import React, {Component} from "react";
import {NodeRendererProps} from "../pocketsPanelModel";
import {bindInstanceMethods} from "../../../../framework.core/extras/utils/typeUtils";

export class NodeRenderer extends Component<NodeRendererProps> {
    constructor(props: any) {
        super(props);

        bindInstanceMethods(this);
    }

    render() {
        const {className, title } = this.props;

        let cn = 'resource-node d-flex justify-content-between';
        if (className) {
            cn += ` ${className}`;
        }

        return (
            <div className={cn}>
                <div className={"d-flex flex-row v-gap-2 justify-content-center align-items-center"}>
                    <div className={"title"}>{title ? title : ''}</div>
                </div>
            </div>
        )
    }
}
