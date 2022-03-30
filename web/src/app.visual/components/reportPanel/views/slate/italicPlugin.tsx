import {ItalicInputProps, KeyEventHandler, LeafType} from "./slateModel";
import React from "react";
import {ReactEditor, useSlate} from "slate-react";
import {Editor} from "slate";
import Button from "../../../../theme/widgets/button/button";
import {TextFormatItalicSVG} from "../../../../theme/svgs/textFormatItalicSVG";
import {isKeyMod} from "./slate-utils";

const markKey = 'italic';

export function renderItalicLeaf(leaf: LeafType, children: any) {
    let result = children;

    if (leaf.italic) {
        result = <i>{result}</i>
    }

    return result;
}

export function ItalicInput(props: ItalicInputProps) {
    const editor = useSlate();

    function _onSelect() {
        italicStrategy(editor);
    }

    return (
        <Button className={'btn-transparent'} onClick={_onSelect} selected={hasItalicMark(editor)}>
            <TextFormatItalicSVG className={'small-image-container'}/>
        </Button>
    )
}

function italicStrategy(editor: Editor) {
    if (hasItalicMark(editor)) {
        editor.removeMark(markKey);
    }
    else {
        editor.addMark(markKey, true);
    }

    ReactEditor.focus(editor);
}

function hasItalicMark (editor: Editor) {
    const marks = Editor.marks(editor) as Record<string, boolean>
    return marks ? marks[markKey] : false
}

export function handleItalicKeyEvent(event: React.KeyboardEvent, editor: Editor): KeyEventHandler {
    let handler = null;

    if (isKeyMod(event) && event.key === 'i') {
        handler = () => italicStrategy(editor)
    }

    return handler;
}