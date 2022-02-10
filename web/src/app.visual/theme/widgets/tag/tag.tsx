import React from "react";
import './tag.css';
import TextEdit from "../textEdit/textEdit";
import {DeleteSVG} from "../../svgs/deleteSVG";
import {bindInstanceMethods} from "../../../../framework/extras/typeUtils";
import {TagProps, TagState} from "./tagModel";

class Tag extends React.Component<TagProps, TagState> {
    constructor(props: any) {
        super(props);

        this.state = {
            isSelected: false,
            tmpText: "",
        }

        bindInstanceMethods(this);
    }

    delete() {
        const { onDelete, name, text } = this.props
        if (onDelete) {
            onDelete(name, text);
        }
    }

    submit(name:string, tmpValue:string) {
        const { onSubmit, text } = this.props;
        if (onSubmit) {
            onSubmit(name, text, tmpValue);
        }
    }

    toggleSelected() {
        const { isSelected } = this.state;

        this.setState({
            ...this.state,
            isSelected: !isSelected,
        })
    };


    render() {
        const {className, onDelete, text, name, isEdit=false, onSubmit, isGlobal=false, readonly=true} = this.props;
        const {tmpText, isSelected} = this.state;

        let cn = 'tag d-flex rounded-pill h-gap-2 cursor-pointer';

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
                <div className={"d-grid"} onClick={this.toggleSelected}>
                    {
                        !isEdit &&
                        <div className={`tag-text display-4 text-nowrap align-self-center ${readonly ? 'px-4' : 'pl-4'}`}>
                            {text}
                        </div>
                    }
                    {
                        isEdit &&
                        <TextEdit
                            className={"pl-4 mr-4 align-self-center"}
                            placeholder={'Enter New Tag'}
                            name={name}
                            dirty={dirty}
                            value={value}
                            onSubmit={this.submit}
                            edit={true}
                            autoFocus={true}/>
                    }
                </div>
                {
                    !readonly &&
                    <div className={'delete-btn align-self-center pr-2'} onClick={this.delete}>
                        <DeleteSVG className={"tiny-image-container"}/>
                    </div>
                }

            </div>
        );
    }
}

export default Tag;
