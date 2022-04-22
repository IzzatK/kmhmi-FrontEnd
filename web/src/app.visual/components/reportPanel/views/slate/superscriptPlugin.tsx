import {ISlateLeafPlugin, LeafType, SuperscriptInputProps} from "./slateModel";
import React from "react";
import {useSlate} from "slate-react";
import {Editor} from "slate";
import Button from "../../../../theme/widgets/button/button";
import {hasMark, toggleMark} from "./slate-utils";

const markKey = 'superscript';

function renderSuperscriptLeaf(leaf: LeafType, children: any) {
    let result = children;

    if (leaf.superscript) {
        result = <sup>{result}</sup>
    }

    return result;
}

export function SuperscriptInput(props: SuperscriptInputProps) {
    const editor = useSlate();

    function _onSelect() {
        superscriptStrategy(editor);
    }

    return (
        <Button className={'btn-transparent'} onClick={_onSelect} selected={hasSuperscriptMark(editor)}>
            <div>X<sup>x</sup></div>
        </Button>
    )
}

function hasSuperscriptMark(editor: Editor) {
    return hasMark(editor, markKey);
}

function superscriptStrategy(editor: Editor) {
    toggleMark(editor, markKey);
}

function handleSuperscriptKeyEvent(event: React.KeyboardEvent, editor: Editor): void {

}

export const superscriptPlugin: ISlateLeafPlugin = {
    handleKeyEvent: handleSuperscriptKeyEvent,
    render: renderSuperscriptLeaf,
}
