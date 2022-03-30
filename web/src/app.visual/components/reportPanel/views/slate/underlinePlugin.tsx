import {KeyEventHandler, LeafType, UnderlineInputProps} from "./slateModel";
import React from "react";
import {useSlate} from "slate-react";
import {Editor} from "slate";
import Button from "../../../../theme/widgets/button/button";
import {TextFormatUnderlineSVG} from "../../../../theme/svgs/textFormatUnderlineSVG";
import {isKeyMod} from "./slate-utils";

const markKey = 'underline';

export function renderUnderlineLeaf(leaf: LeafType, children: any) {
    let result = children;

    if (leaf.underline) {
        result = <u>{result}</u>
    }

    return result;
}

export function UnderlineInput(props: UnderlineInputProps) {
    const editor = useSlate();

    function _onSelect() {
        underlineStrategy(editor);
    }

    return (
        <Button className={'btn-transparent'} onClick={_onSelect} selected={hasUnderlineMark(editor)}>
            <TextFormatUnderlineSVG className={'small-image-container'}/>
        </Button>
    )
}

function underlineStrategy(editor: Editor) {
    if (hasUnderlineMark(editor)) {
        editor.removeMark(markKey);
    }
    else {
        editor.addMark(markKey, true);
    }
}

function hasUnderlineMark (editor: Editor) {
    const marks = Editor.marks(editor) as Record<string, boolean>
    return marks ? marks[markKey] : false
}

export function handleUnderlineKeyEvent(event: React.KeyboardEvent, editor: Editor): KeyEventHandler {
    let handler = null;

    if (isKeyMod(event) && event.key === 'u') {
        handler = () => underlineStrategy(editor)
    }

    return handler;
}