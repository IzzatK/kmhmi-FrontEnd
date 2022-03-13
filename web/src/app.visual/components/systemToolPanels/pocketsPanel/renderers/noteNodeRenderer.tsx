import React, {Component} from "react";
import {NodeRendererProps, PocketNodeRendererState, ResourceNodeRendererProps} from "../pocketsPanelModel";
import Button from "../../../../theme/widgets/button/button";
import {DownloadSVG} from "../../../../theme/svgs/downloadSVG";
import {RemoveSVG} from "../../../../theme/svgs/removeSVG";
import {ShareSVG} from "../../../../theme/svgs/shareSVG";
import {SettingsSVG} from "../../../../theme/svgs/settingsSVG";

export class NoteNodeRenderer extends Component<NodeRendererProps> {
    constructor(props: any) {
        super(props);
    }

    render() {
        const {className, id, title, path, selected } = this.props;

        let cn = "note-node d-flex flex-fill justify-content-between";

        if (className) {
            cn += ` ${className}`;
        }
        if (selected) {
            cn += ` selected`
        }

        return (
            <div onClick={() => this.props.onSelect(path, selected)} className={cn}>
                <div className={"d-flex flex-row v-gap-2 justify-content-center align-items-center"}>
                    <div className={"node-title"}>{title ? title : ''}</div>
                </div>
                <div className={'action-bar d-flex h-gap-3'}>

                </div>
            </div>
        )
    }
}
