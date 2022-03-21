import React, {Component} from "react";
import {PocketNodeRendererProps, PocketNodeRendererState} from "../pocketsPanelModel";
import Button from "../../../../theme/widgets/button/button";
import {ShareSVG} from "../../../../theme/svgs/shareSVG";
import {DownloadSVG} from "../../../../theme/svgs/downloadSVG";
import {SettingsSVG} from "../../../../theme/svgs/settingsSVG";
import {bindInstanceMethods} from "../../../../../framework.core/extras/utils/typeUtils";
import {RemoveSVG} from "../../../../theme/svgs/removeSVG";

export class PocketNodeRenderer extends Component<PocketNodeRendererProps, PocketNodeRendererState> {
    constructor(props: any) {
        super(props);

        bindInstanceMethods(this);
    }

    _onShare(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        event.stopPropagation();

        if (this.props.onShare != null) {
            this.props.onShare(this.props.id);
        }
    }

    _onDownload(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        event.stopPropagation();

        if (this.props.onDownload != null) {
            this.props.onDownload(this.props.id);
        }
    }

    _onSettings(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        event.stopPropagation();

        if (this.props.onSettings != null) {
            this.props.onSettings(this.props.id);
        }
    }


    render() {
        const {className, title } = this.props;

        let cn = 'pocket-node d-flex justify-content-between';
        if (className) {
            cn += ` ${className}`;
        }

        return (
            <div className={cn}>
                <div className={"d-flex flex-row v-gap-2 justify-content-center align-items-center"}>
                    <div className={"title"}>{title ? title : ''}</div>
                </div>
                <div className={'action-bar d-flex h-gap-3'}>
                    <Button onClick={this._onShare}>
                        <ShareSVG className={"small-image-container"}/>
                    </Button>
                    <Button onClick={this._onDownload}>
                        <DownloadSVG className={"small-image-container"}/>
                    </Button>
                    <Button onClick={this._onSettings}>
                        <SettingsSVG className={"small-image-container"}/>
                    </Button>
                </div>
            </div>
        )
    }
}
