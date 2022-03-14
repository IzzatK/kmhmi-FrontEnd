import React, {Component} from "react";
import {NodeRendererProps, PocketNodeRendererState, ResourceNodeRendererProps} from "../pocketsPanelModel";
import Button from "../../../../theme/widgets/button/button";
import {DownloadSVG} from "../../../../theme/svgs/downloadSVG";
import {RemoveSVG} from "../../../../theme/svgs/removeSVG";
import {ShareSVG} from "../../../../theme/svgs/shareSVG";
import {SettingsSVG} from "../../../../theme/svgs/settingsSVG";
import {bindInstanceMethods} from "../../../../../framework.core/extras/typeUtils";

export class ResourceNodeRenderer extends Component<ResourceNodeRendererProps> {
    constructor(props: any) {
        super(props);

        bindInstanceMethods(this);
    }

    _onDownload(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        event.stopPropagation();

        if (this.props.onDownload != null) {
            this.props.onDownload(this.props.id);
        }
    }

    _onRemove(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        event.stopPropagation();

        if (this.props.onRemove != null) {
            this.props.onRemove(this.props.id);
        }
    }

    render() {
        const {className, id, title, path, selected } = this.props;

        let cn = "resource-node d-flex flex-fill justify-content-between";

        if (className) {
            cn += ` ${className}`;
        }
        if (selected) {
            cn += ` selected`
        }

        return (
            <div onClick={() => this.props.onSelect && this.props.onSelect(path, selected)} className={cn}>
                <div className={"d-flex flex-row v-gap-2 justify-content-center align-items-center"}>
                    <div className={"title"}>{title ? title : ''}</div>
                </div>
                <div className={'action-bar d-flex h-gap-3'}>
                    <Button onClick={this._onDownload}>
                        <DownloadSVG className={"small-image-container"}/>
                    </Button>
                    <Button onClick={this._onRemove}>
                        <RemoveSVG className={"small-image-container"}/>
                    </Button>
                </div>
            </div>
        )
    }
}
