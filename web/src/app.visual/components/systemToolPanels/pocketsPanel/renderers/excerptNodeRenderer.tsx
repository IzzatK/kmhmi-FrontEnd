import React, {Component} from "react";
import {NodeRendererProps, PocketNodeRendererState, ResourceNodeRendererProps} from "../pocketsPanelModel";
import Button from "../../../../theme/widgets/button/button";
import {DownloadSVG} from "../../../../theme/svgs/downloadSVG";
import {RemoveSVG} from "../../../../theme/svgs/removeSVG";
import {ShareSVG} from "../../../../theme/svgs/shareSVG";
import {SettingsSVG} from "../../../../theme/svgs/settingsSVG";
import {bindInstanceMethods} from "../../../../../framework.core/extras/typeUtils";

export class ExcerptNodeRenderer extends Component<NodeRendererProps> {
    constructor(props: any) {
        super(props);

        bindInstanceMethods(this);
    }

    render() {
        const {className, title, path, selected } = this.props;

        let cn = "excerpt-node d-flex flex-fill justify-content-between";

        if (className) {
            cn += ` ${className}`;
        }
        if (selected) {
            cn += ` selected`
        }

        return (
            <div onClick={() => this.props.onSelect(path, selected)} className={cn}>
                <div className={"d-flex flex-row v-gap-2 justify-content-center align-items-center"}>
                    <div className={"title"}>{title ? title : ''}</div>
                </div>
                <div className={'action-bar d-flex h-gap-3'}>

                </div>
            </div>
        )
    }
}
