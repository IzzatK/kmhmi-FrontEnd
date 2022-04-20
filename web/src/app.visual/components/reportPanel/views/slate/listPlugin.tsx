import {Editor, Element as SlateElement, Transforms} from "slate";
import {
    ElementType, ISlateElementPlugin,
    ISlateLeafPlugin,
    LIST_TYPE,
    ListInputButtonProps,
    TEXT_ALIGN_TYPE,
    TextAlignInputToolbarProps
} from "./slateModel";
import {isMultiElementActive} from "./slate-utils";
import {ReactEditor, useSlate} from "slate-react";
import Button from "../../../../theme/widgets/button/button";
import React from "react";
import {TextListNumber} from "../../../../theme/svgs/textListNumber";
import {TextListBulletSVG} from "../../../../theme/svgs/textListBulletSVG";

const pluginKey = 'type';
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
    try {
        const editor = useSlate();

        const {list, onClick, ...rest} = props;

        const selected = isListActive(
            editor,
            list);

        const _onSelect = (event: React.MouseEvent) => {
            event.preventDefault();
            listStrategy(editor, list);
        }

        return (
            <Button className={'btn-transparent'} {...rest} selected={selected} onClick={_onSelect}>
                {props.children}
            </Button>
        )
    } catch (error) {
        console.log(error);
        return (
            <Button className={'btn-transparent'}>
                {props.children}
            </Button>
        )
    }

}


function renderListElement(element: ElementType, children: any, attributes: any) {
    let result = children;

    switch (element.type) {
        case 'bulleted':
            result =  (
                <ul {...attributes}>
                    {children}
                </ul>
            );
            break;
        case 'numbered':
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

function listStrategy(editor: Editor, listType: LIST_TYPE) {
    const isActive = isListActive(
        editor,
        listType
    );

    Transforms.unwrapNodes(editor, {
        match: (n) =>
            !Editor.isEditor(n) &&
            SlateElement.isElement(n) &&
            (n as ElementType).type in LIST_TYPE,
        split: true,
    });

    const element: Partial<ElementType> = {
        type: isActive ? defaultValue : 'list-item'
    }

    Transforms.setNodes<ElementType>(editor, element)

    if (!isActive) {
        const block = { type: listType, children: [] }
        Transforms.wrapNodes(editor, block)
    }

    ReactEditor.focus(editor);
}

function isListActive (editor: Editor, list: LIST_TYPE) {
    return isMultiElementActive(editor, pluginKey, list);
}

export const listPlugin: ISlateElementPlugin = {
    render: renderListElement,
}
