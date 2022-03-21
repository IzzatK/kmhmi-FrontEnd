import React, {Component} from "react";
import {NodeRendererProps, PocketNodeRendererState, ResourceNodeRendererProps} from "../pocketsPanelModel";
import Button from "../../../../theme/widgets/button/button";
import {DownloadSVG} from "../../../../theme/svgs/downloadSVG";
import {RemoveSVG} from "../../../../theme/svgs/removeSVG";
import {ShareSVG} from "../../../../theme/svgs/shareSVG";
import {SettingsSVG} from "../../../../theme/svgs/settingsSVG";
import {bindInstanceMethods} from "../../../../../framework.core/extras/utils/typeUtils";
import {CopySVG} from "../../../../theme/svgs/copySVG";

export class NoteNodeRenderer extends Component<NodeRendererProps> {
    constructor(props: any) {
        super(props);

        bindInstanceMethods(this);
    }

    render() {
        const {className, title } = this.props;

        let cn = 'note-node light d-flex h-gap-3';
        if (className) {
            cn += ` ${className}`;
        }

        return (
            <div className={cn}>
                <Button>
                    <CopySVG className={"small-image-container"}/>
                </Button>
                <div className={"d-flex flex-row v-gap-2 justify-content-center align-items-center"}>
                    <div className={"title"}>{title ? title : ''}</div>
                </div>
                <div className={'action-bar d-flex h-gap-3'}>
                    <Button>
                        <RemoveSVG className={"small-image-container"}/>
                    </Button>
                </div>
            </div>
        )
    }
}
