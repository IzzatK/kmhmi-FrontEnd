import {Editor, Transforms} from "slate";
import {ElementType, LIST_TYPE, ListInputButtonProps, TEXT_ALIGN_TYPE, TextAlignInputToolbarProps} from "./slateModel";
import {isMultiElementActive} from "./slate-utils";
import {useSlate} from "slate-react";
import Button from "../../../../theme/widgets/button/button";
import React from "react";
import {TextListNumber} from "../../../../theme/svgs/textListNumber";
import {TextListBulletSVG} from "../../../../theme/svgs/textListBulletSVG";
import {elementType} from "prop-types";

const pluginKey = 'list';
const defaultValue = undefined;

export function ListInputToolbar(props: TextAlignInputToolbarProps) {
    return (
        <div className={'list-input-toolbar d-flex h-gap-2'}>
            <ListInputButton list={LIST_TYPE.numbered}>
                <TextListNumber className={'small-image-container'}/>
            </ListInputButton>
            <ListInputButton list={LIST_TYPE.bulleted}>
                <TextListBulletSVG className={'small-image-container'}/>
            </ListInputButton>
        </div>
    )
}

export function ListInputButton(props: ListInputButtonProps) {
    const editor = useSlate();

    const {list, onClick, ...rest} = props;

    const selected = isListActive(
        editor,
        list);

    function _onSelect(event: React.MouseEvent) {
        event.preventDefault();
        listStrategy(editor, list);
    }

    return (
        <Button className={'btn-transparent'} {...rest} selected={selected} onClick={_onSelect}>
            {props.children}
        </Button>
    )
}


export function renderListElement(element: ElementType, children: any, attributes: any) {
    let result = children;

    switch (element.type) {
        case 'bulleted-list':
            result =  (
                <ul {...attributes}>
                    {children}
                </ul>
            );
            break;
        case 'numbered-list':
            result = (
                <ol {...attributes}>
                    {children}
                </ol>
            );
            break;
        case 'list-item':
            result =  (
                <li {...attributes}>
                    {children}
                </li>
            );
            break;
    }

    return result;
}

function listStrategy(editor: Editor, value: any) {
    const isActive = isListActive(
        editor,
        value
    )
    
    let element: Partial<ElementType>;
    element = {
        align: isActive ? defaultValue : value as TEXT_ALIGN_TYPE,
    }
    Transforms.setNodes<ElementType>(editor, element)
}

function isListActive (editor: Editor, list: LIST_TYPE) {
    return isMultiElementActive(editor, pluginKey, list);
}