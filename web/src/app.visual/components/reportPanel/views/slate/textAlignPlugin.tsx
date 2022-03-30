import {Editor, Transforms} from "slate";
import {ElementType, TEXT_ALIGN_TYPE, TextAlignInputButtonProps, TextAlignInputToolbarProps} from "./slateModel";
import {isMultiElementActive} from "./slate-utils";
import {useSlate} from "slate-react";
import Button from "../../../../theme/widgets/button/button";
import React from "react";
import {TextAlignLeftSVG} from "../../../../theme/svgs/textAlignLeftSVG";
import {TextAlignCenterSVG} from "../../../../theme/svgs/textAlignCenterSVG";
import {TextAlignRightSVG} from "../../../../theme/svgs/textAlignRightSVG";
import {TextAlignJustifySVG} from "../../../../theme/svgs/textAlignJustifySVG";

const pluginKey = 'align';
const defaultValue = TEXT_ALIGN_TYPE.left;

export function TextAlignInputToolbar(props: TextAlignInputToolbarProps) {
    return (
        <div className={'text-align-input-toolbar d-flex h-gap-2'}>
            <TextAlignInputButton align={TEXT_ALIGN_TYPE.left}>
                <TextAlignLeftSVG className={'small-image-container'}/>
            </TextAlignInputButton>
            <TextAlignInputButton align={TEXT_ALIGN_TYPE.center}>
                <TextAlignCenterSVG className={'small-image-container'}/>
            </TextAlignInputButton>
            <TextAlignInputButton align={TEXT_ALIGN_TYPE.right}>
                <TextAlignRightSVG className={'small-image-container'}/>
            </TextAlignInputButton>
            <TextAlignInputButton align={TEXT_ALIGN_TYPE.justify}>
                <TextAlignJustifySVG className={'small-image-container'}/>
            </TextAlignInputButton>
        </div>
    )
}

export function TextAlignInputButton(props: TextAlignInputButtonProps) {
    const editor = useSlate();

    const {align, onClick, ...rest} = props;

    const selected = isTextAlignActive(
        editor,
        props.align);

    function _onSelect(event: React.MouseEvent) {
        event.preventDefault();
        textAlignStrategy(editor, align);
    }

    return <Button className={'btn-transparent'} {...rest} selected={selected} onClick={_onSelect}>
        {props.children}
    </Button>
}


export function renderTextAlignElement(element: ElementType, children: any, attributes: any) {
    let result = children;

    if (element.align) {
        const style = {
            textAlign: element.align || TEXT_ALIGN_TYPE.left,
        }

        result = (
            <div {...attributes} style={style}>
                {result}
            </div>
        )
    }

    return result;
}

function textAlignStrategy(editor: Editor, value: any) {
    const isActive = isTextAlignActive(
        editor,
        value
    )

    const element: Partial<ElementType> = {
        align: isActive ? defaultValue : value as TEXT_ALIGN_TYPE,
    }

    Transforms.setNodes<ElementType>(editor, element)
}

function isTextAlignActive (editor: Editor, format: TEXT_ALIGN_TYPE) {
    return isMultiElementActive(editor, pluginKey, format);
}