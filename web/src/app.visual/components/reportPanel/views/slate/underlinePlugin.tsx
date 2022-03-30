import {ISlateLeafPlugin, KeyEventHandler, LeafType, UnderlineInputProps} from "./slateModel";
import React from "react";
import {ReactEditor, useSlate} from "slate-react";
import {Editor} from "slate";
import Button from "../../../../theme/widgets/button/button";
import {TextFormatUnderlineSVG} from "../../../../theme/svgs/textFormatUnderlineSVG";
import {hasMark, isKeyMod, toggleMark} from "./slate-utils";

const markKey = 'underline';

function renderUnderlineLeaf(leaf: LeafType, children: any) {
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
    toggleMark(editor, markKey);
}

function hasUnderlineMark (editor: Editor) {
    return hasMark(editor, markKey);
}

function handleUnderlineKeyEvent(event: React.KeyboardEvent, editor: Editor): KeyEventHandler {
    let handler = null;

    if (isKeyMod(event) && event.key === 'u') {
        handler = () => underlineStrategy(editor)
    }

    return handler;
}

export const underlinePlugin: ISlateLeafPlugin = {
    handleKeyEvent: handleUnderlineKeyEvent,
    render: renderUnderlineLeaf,
}