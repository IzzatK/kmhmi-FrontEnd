import React, {Component} from "react";
import {NoteNodeRendererProps} from "../../pocketsPanelModel";
import {bindInstanceMethods} from "../../../../../framework.core/extras/utils/typeUtils";
import Button from "../../../../theme/widgets/button/button";
import {NoteSVG} from "../../../../theme/svgs/noteSVG";
import {RemoveSVG} from "../../../../theme/svgs/removeSVG";
import CheckBox from "../../../../theme/widgets/checkBox/checkBox";

export class NoteNodeRenderer extends Component<NoteNodeRendererProps> {
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

    render() {
        const {className, title, selected } = this.props;

        let cn = 'note-node light d-flex h-gap-3';
        if (className) {
            cn += ` ${className}`;
        }

        return (
            <div className={cn}>
                <CheckBox selected={selected} disabled={true}/>
                <Button className={"btn-transparent"} disabled={true}>
                    <NoteSVG className={"small-image-container"}/>
                </Button>
                <div className={"d-flex flex-fill justify-content-between"}>
                    <div className={"d-flex flex-row v-gap-2 justify-content-center align-items-center"}>
                        <div className={"title font-italic"}>{title}</div>
                    </div>
                    {/*<div className={'action-bar d-flex h-gap-3'}>*/}
                    {/*    /!*<Button className={"btn-transparent"} onClick={(e) => {e.stopPropagation()}} tooltip={"Copy to Clipboard"}>*!/*/}
                    {/*    /!*    <CopySVG className={"small-image-container"}/>*!/*/}
                    {/*    /!*</Button>*!/*/}
                    {/*    <Button className={"btn-transparent"} onClick={this._onRemove} tooltip={"Remove"}>*/}
                    {/*        <RemoveSVG className={"small-image-container"}/>*/}
                    {/*    </Button>*/}
                    {/*</div>*/}
                </div>
            </div>
        )
    }
}
