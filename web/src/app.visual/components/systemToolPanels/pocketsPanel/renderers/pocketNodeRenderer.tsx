import React, {Component} from "react";
import {PocketNodeRendererProps, PocketNodeRendererState} from "../pocketsPanelModel";
import Button from "../../../../theme/widgets/button/button";
import {ShareSVG} from "../../../../theme/svgs/shareSVG";
import {DownloadSVG} from "../../../../theme/svgs/downloadSVG";
import {SettingsSVG} from "../../../../theme/svgs/settingsSVG";

export class PocketNodeRenderer extends Component<PocketNodeRendererProps, PocketNodeRendererState> {
    constructor(props: any) {
        super(props);
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
        const {className, title, path, selected, id } = this.props;

        let cn = "pocket-node d-flex flex-fill justify-content-between";

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
