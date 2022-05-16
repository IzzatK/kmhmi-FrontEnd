import React, {Component} from "react";
import {
    NoteNodeRendererProps, NoteNodeRenderState, NoteVM,
    PocketNodeRendererProps,
    PocketNodeRendererState,
    PocketTabType
} from "../../pocketsPanelModel";
import {bindInstanceMethods} from "../../../../../framework.core/extras/utils/typeUtils";
import Button from "../../../../theme/widgets/button/button";
import {NoteSVG} from "../../../../theme/svgs/noteSVG";
import {RemoveSVG} from "../../../../theme/svgs/removeSVG";
import CheckBox from "../../../../theme/widgets/checkBox/checkBox";
import TextEdit from "../../../../theme/widgets/textEdit/textEdit";

export class NoteNodeRenderer extends Component<NoteNodeRendererProps, NoteNodeRenderState> {
    constructor(props: any) {
        super(props);

        bindInstanceMethods(this);

        this.state = {
            edits: {
                id: '',
            },
        }
    }

    componentDidMount() {
        const { id } = this.props;

        this.setState({
            ...this.state,
            edits: {
                id,
            }
        });
    }

    componentDidUpdate(prevProps: Readonly<NoteNodeRendererProps>, prevState: Readonly<NoteNodeRenderState>, snapshot?: any) {
        if (prevProps != this.props) {
            const { id } = this.props;

            this.setState({
                ...this.state,
                edits: {
                    id,
                }
            });
        }
    }

    private _onSave(value: string) {
        const { onSave, id, excerpt_id, resource_id, pocket_id } = this.props;
        const { edits } = this.state;

        const noteVM: NoteVM = {
            id,
            content: value,
            text: value,
            excerpt_id,
            resource_id,
            pocket_id,
        }


        if (onSave && value !== "") {
            onSave(noteVM);
        }
    }

    private _onPropertyUpdate(name: string, value: string) {
        const { edits } = this.state;

        this.setState({
            ...this.state,
            edits: {
                ...edits,
                [name]: value
            }
        })
    }

    _onRemove(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        const { onRemove, id } = this.props;

        event.stopPropagation();

        if (onRemove) {
            onRemove(id);
        }
    }

    render() {
        const {className, title, selected, isEdit } = this.props;

        let cn = 'note-node light d-flex h-gap-3 align-items-center';
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
                        {
                            isEdit ?
                                <TextEdit
                                    name={'title'}
                                    value={title}
                                    onChange={(value: string) => this._onPropertyUpdate('text', value)}
                                    placeholder={"Type Note Content Here"}
                                    autoFocus={true}
                                    onSubmit={(name, value) => this._onSave(value)}
                                />
                                :
                                <div className={"title font-italic"}>{title}</div>
                        }
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
