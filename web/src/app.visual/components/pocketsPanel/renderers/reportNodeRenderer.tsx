import React, {Component} from "react";
import {ReportNodeRendererProps} from "../pocketsPanelModel";
import Button from "../../../theme/widgets/button/button";
import {DownloadSVG} from "../../../theme/svgs/downloadSVG";
import {RemoveSVG} from "../../../theme/svgs/removeSVG";
import {bindInstanceMethods} from "../../../../framework.core/extras/utils/typeUtils";

export class ReportNodeRenderer extends Component<ReportNodeRendererProps> {
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
        const {className, title } = this.props;

        let cn = 'report-node light d-flex justify-content-between';
        if (className) {
            cn += ` ${className}`;
        }

        return (
            <div className={cn}>
                <div className={"d-flex flex-row v-gap-2 justify-content-center align-items-center"}>
                    <div className={"title font-italic font-weight-semi-bold"}>Report: {title ? title : ''}</div>
                </div>
                <div className={'action-bar d-flex h-gap-3'}>
                    <Button className={"btn-transparent"} onClick={this._onDownload} tooltip={"Download"}>
                        <DownloadSVG className={"small-image-container"}/>
                    </Button>
                    <Button className={"btn-transparent"} onClick={this._onRemove} tooltip={"Remove"}>
                        <RemoveSVG className={"small-image-container"}/>
                    </Button>
                </div>
            </div>
        )
    }
}
