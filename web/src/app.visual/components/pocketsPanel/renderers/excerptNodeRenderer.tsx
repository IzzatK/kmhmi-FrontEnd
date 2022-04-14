import React, {Component} from "react";
import {ExcerptNodeRendererProps} from "../pocketsPanelModel";
import Button from "../../../theme/widgets/button/button";
import {RemoveSVG} from "../../../theme/svgs/removeSVG";
import {bindInstanceMethods} from "../../../../framework.core/extras/utils/typeUtils";
import {CopySVG} from "../../../theme/svgs/copySVG";
import {ExcerptSVG} from "../../../theme/svgs/excerptSVG";

export class ExcerptNodeRenderer extends Component<ExcerptNodeRendererProps> {
    constructor(props: any) {
        super(props);

        bindInstanceMethods(this);
    }

    _onRemove(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        const { onRemove, id } = this.props;
        event.stopPropagation();

        if (onRemove) {
            onRemove(id);
        }
    }

    _onDragStart(event: React.DragEvent<HTMLDivElement>) {
        event.dataTransfer.setData("text/plain", this.props.title ? this.props.title : "");
        event.dataTransfer.setData("text/excerpt", "resource information");
        event.dataTransfer.setData("text/excerpt/excerpt_id", this.props.id);
    }

    render() {
        const { className, title } = this.props;

        let cn = 'excerpt-node light d-flex h-gap-3';
        if (className) {
            cn += ` ${className}`;
        }

        return (
            <div draggable={true} className={cn} onDragStart={(e) => this._onDragStart(e)}>
                <Button className={"btn-transparent"} disabled={true}>
                    <ExcerptSVG className={"small-image-container"}/>
                </Button>
                <div className={"d-flex flex-fill justify-content-between"}>
                    <div className={"d-flex flex-row v-gap-2 justify-content-center align-items-center"}>
                        <div className={"title font-italic"}>{title}</div>
                    </div>
                    <div className={'action-bar h-gap-3'}>
                        <Button className={"btn-transparent"} onClick={(e) => {e.stopPropagation()}} tooltip={"Copy to Clipboard"}>
                            <CopySVG className={"small-image-container"}/>
                        </Button>
                        <Button className={"btn-transparent"} onClick={this._onRemove} tooltip={"Remove"}>
                            <RemoveSVG className={"small-image-container"}/>
                        </Button>
                    </div>
                </div>

            </div>
        )
    }
}
