import React, {Component} from "react";
import {bindInstanceMethods} from "../../../../../framework.core/extras/utils/typeUtils";
import Button from "../../../../theme/widgets/button/button";
import {RemoveSVG} from "../../../../theme/svgs/removeSVG";
import {ResourceNodeRendererProps} from "../../pocketsPanelModel";
import {DownloadSVG} from "../../../../theme/svgs/downloadSVG";
import CheckBox from "../../../../theme/widgets/checkBox/checkBox";
import {DocumentInfoSVG} from "../../../../theme/svgs/documentInfoSVG";

export class ResourceNodeRenderer extends Component<ResourceNodeRendererProps> {
    constructor(props: any) {
        super(props);

        bindInstanceMethods(this);
    }

    _onDownload(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        const { onDownload, id } = this.props;
        event.stopPropagation();

        if (onDownload) {
            onDownload(id);
        }
    }

    _onRemove(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        const { onRemove, id } = this.props;
        event.stopPropagation();

        if (onRemove) {
            onRemove(id);
        }
    }

    render() {
        const {className, title, selected } = this.props;

        let cn = 'resource-node light d-flex h-gap-3 align-items-center';
        if (className) {
            cn += ` ${className}`;
        }

        return (
            <div className={cn}>
                <CheckBox selected={selected} disabled={true}/>
                <Button className={"btn-transparent"} disabled={true}>
                    <DocumentInfoSVG className={"small-image-container"}/>
                </Button>
                <div className={"d-flex flex-row v-gap-2 justify-content-center align-items-center"}>
                    <div className={"title"}>{title ? title : ''}</div>
                </div>
                {/*<div className={'action-bar d-flex h-gap-3'}>*/}
                {/*    <Button className={"btn-transparent"} onClick={this._onDownload} tooltip={"Download"}>*/}
                {/*        <DownloadSVG className={"small-image-container"}/>*/}
                {/*    </Button>*/}
                {/*    <Button className={"btn-transparent"} onClick={this._onRemove} tooltip={"Remove"}>*/}
                {/*        <RemoveSVG className={"small-image-container"}/>*/}
                {/*    </Button>*/}
                {/*</div>*/}
            </div>
        )
    }
}
