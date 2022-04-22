import {ISlateLeafPlugin, LeafType, SubscriptInputProps} from "./slateModel";
import React from "react";
import {useSlate} from "slate-react";
import {Editor} from "slate";
import Button from "../../../../theme/widgets/button/button";
import {hasMark, toggleMark} from "./slate-utils";

const markKey = 'subscript';

function renderSubscriptLeaf(leaf: LeafType, children: any) {
    let result = children;

    if (leaf.subscript) {
        result = <sub>{result}</sub>
    }

    return result;
}

export function SubscriptInput(props: SubscriptInputProps) {
    const editor = useSlate();

    function _onSelect() {
        subscriptStrategy(editor);
    }

    return (
        <Button className={'btn-transparent'} onClick={_onSelect} selected={hasSubscriptMark(editor)}>
            <div>X<sub>x</sub></div>
        </Button>
    )
}

function hasSubscriptMark(editor: Editor) {
    return hasMark(editor, markKey);
}

function subscriptStrategy(editor: Editor) {
    toggleMark(editor, markKey);
}

function handleSubscriptKeyEvent(event: React.KeyboardEvent, editor: Editor): void {

}

export const subscriptPlugin: ISlateLeafPlugin = {
    handleKeyEvent: handleSubscriptKeyEvent,
    render: renderSubscriptLeaf,
}
