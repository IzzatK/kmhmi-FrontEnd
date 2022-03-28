import React from "react";
import './tag.css';
import TextEdit from "../textEdit/textEdit";
import {DeleteSVG} from "../../svgs/deleteSVG";
import {bindInstanceMethods} from "../../../../framework.core/extras/utils/typeUtils";
import {TagProps, TagState} from "./tagModel";

class Tag extends React.Component<TagProps, TagState> {
    constructor(props: any) {
        super(props);

        this.state = {
            selected: false,
            tmpText: "",
        }

        bindInstanceMethods(this);
    }

    _onDelete() {
        const { onDelete, name, text } = this.props;

        if (onDelete) {
            onDelete(name, text);
        }
    }

    _onSubmit(name: string, tmpValue: string) {
        const { onSubmit, text } = this.props;

        if (onSubmit) {
            onSubmit(name, text, tmpValue);
        }
    }

    _toggleSelected() {
        const { selected } = this.state;

        this.setState({
            ...this.state,
            selected: !selected,
        })
    };


    render() {
        const { className, text, name, isEdit=false, isGlobal=false, readonly=true } = this.props;
        const { tmpText, selected } = this.state;

        let cn = 'tag d-flex rounded-pill cursor-pointer';

        if (className) {
            cn += ` ${className}`;
        }

        if (isGlobal) {
            cn += ` global`
        }

        if (isEdit) {
            cn += ` edit`;
        }

        let editValue = tmpText ? tmpText : '';

        let dirty = !!editValue
        let value = editValue ? editValue : '';

        return (
            <div className={cn}>
                <div className={"d-grid"} onClick={this._toggleSelected}>
                    {
                        isEdit ?
                        <TextEdit
                            className={"pl-4 mr-4 align-self-center"}
                            placeholder={'Enter New Tag'}
                            name={name}
                            dirty={dirty}
                            value={value}
                            onSubmit={this._onSubmit}
                            edit={true}
                            autoFocus={true}
                        />
                        :
                        <div className={`tag-text display-4 text-nowrap align-self-center pr-4 ${readonly ? 'px-4' : 'pl-4'}`}>
                            {text}
                        </div>
                    }
                </div>
                {
                    (!readonly && (selected || isEdit)) &&
                    <div className={'delete-btn align-self-center pr-2'} onClick={this._onDelete}>
                        <DeleteSVG className={"tiny-image-container"}/>
                    </div>
                }
            </div>
        );
    }
}

export default Tag;
