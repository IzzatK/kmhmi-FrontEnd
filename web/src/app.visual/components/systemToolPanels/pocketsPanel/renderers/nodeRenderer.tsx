import React, {Component} from "react";
import {NodeRendererProps, PocketNodeRendererState, ResourceNodeRendererProps} from "../pocketsPanelModel";
import Button from "../../../../theme/widgets/button/button";
import {DownloadSVG} from "../../../../theme/svgs/downloadSVG";
import {RemoveSVG} from "../../../../theme/svgs/removeSVG";
import {ShareSVG} from "../../../../theme/svgs/shareSVG";
import {SettingsSVG} from "../../../../theme/svgs/settingsSVG";
import {bindInstanceMethods} from "../../../../../framework.core/extras/typeUtils";

export class NodeRenderer extends Component<NodeRendererProps> {
    constructor(props: any) {
        super(props);

        bindInstanceMethods(this);
    }

    render() {
        const {className, path, selected, children } = this.props;

        let cn = "node d-flex flex-fill justify-content-between";

        if (className) {
            cn += ` ${className}`;
        }
        if (selected) {
            cn += ` selected`
        }

        return (
            <div className={cn} onClick={() => this.props.onSelect && this.props.onSelect(path, selected)}>
                {children}
            </div>
        )
    }
}
