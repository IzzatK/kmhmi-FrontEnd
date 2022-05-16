import React, {Component} from "react";
import {bindInstanceMethods} from "../../../../../framework.core/extras/utils/typeUtils";
import Button from "../../../../theme/widgets/button/button";
import {RemoveSVG} from "../../../../theme/svgs/removeSVG";
import {ReportNodeRendererProps} from "../../pocketsPanelModel";
import CheckBox from "../../../../theme/widgets/checkBox/checkBox";
import {ReportInfoSVG} from "../../../../theme/svgs/reportInfoSVG";

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
        const {className, title, selected } = this.props;

        let cn = 'report-node light d-flex h-gap-3 align-items-center';
        if (className) {
            cn += ` ${className}`;
        }

        return (
            <div className={cn}>
                <CheckBox selected={selected} disabled={true}/>
                <Button className={"btn-transparent"} disabled={true}>
                    <ReportInfoSVG className={"small-image-container"}/>
                </Button>
                <div className={"d-flex flex-row v-gap-2 justify-content-center align-items-center"}>
                    <div className={"title font-italic font-weight-semi-bold"}>Report: {title ? title : ''}</div>
                </div>
                {/*<div className={'action-bar d-flex h-gap-3'}>*/}
                {/*    /!*<Button className={"btn-transparent"} onClick={this._onDownload} tooltip={"Download"}>*!/*/}
                {/*    /!*    <DownloadSVG className={"small-image-container"}/>*!/*/}
                {/*    /!*</Button>*!/*/}
                {/*    <Button className={"btn-transparent"} onClick={this._onRemove} tooltip={"Remove"}>*/}
                {/*        <RemoveSVG className={"small-image-container"}/>*/}
                {/*    </Button>*/}
                {/*</div>*/}
            </div>
        )
    }
}
