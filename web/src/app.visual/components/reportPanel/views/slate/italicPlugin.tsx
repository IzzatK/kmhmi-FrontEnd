import {ISlateLeafPlugin, ItalicInputProps, LeafType} from "./slateModel";
import React from "react";
import {ReactEditor, useSlate} from "slate-react";
import {Editor} from "slate";
import Button from "../../../../theme/widgets/button/button";
import {TextFormatItalicSVG} from "../../../../theme/svgs/textFormatItalicSVG";
import {hasMark, isKeyMod, toggleMark} from "./slate-utils";

const markKey = 'italic';

function renderItalicLeaf(leaf: LeafType, children: any) {
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

function hasItalicMark(editor: Editor) {
    return hasMark(editor, markKey);
}

function italicStrategy(editor: Editor) {
    toggleMark(editor, markKey);
}

function handleItalicKeyEvent(event: React.KeyboardEvent, editor: Editor): void {
    if (isKeyMod(event) && event.key === 'i') {
        italicStrategy(editor);
    }
}

export const italicPlugin: ISlateLeafPlugin = {
    handleKeyEvent: handleItalicKeyEvent,
    render: renderItalicLeaf,
}