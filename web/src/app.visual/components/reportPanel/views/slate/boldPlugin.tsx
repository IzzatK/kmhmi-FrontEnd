import {
    BoldInputProps,
    ISlateLeafPlugin,
    LeafType
} from "./slateModel";
import React from "react";
import {useSlate} from "slate-react";
import {Editor} from "slate";
import Button from "../../../../theme/widgets/button/button";
import {TextFormatBoldSVGD} from "../../../../theme/svgs/textFormatBoldSVG";
import {hasMark, isKeyMod, toggleMark} from "./slate-utils";

const markKey = 'bold';

function renderBoldLeaf(leaf: LeafType, children: any) {
    let result = children;

    if (leaf.bold) {
        result = <strong>{result}</strong>
    }

    return result;
}

export function BoldInput(props: BoldInputProps) {
    const editor = useSlate();

    function _onSelect(event: React.MouseEvent) {
        event.preventDefault();
        boldStrategy(editor);
    }

    return (
        <Button className={'btn-transparent'} onClick={_onSelect} selected={hasBoldMark(editor)}>
            <TextFormatBoldSVGD className={'small-image-container'}/>
        </Button>
    )
}

function hasBoldMark(editor: Editor) {
    return hasMark(editor, markKey);
}

function boldStrategy(editor: Editor) {
    toggleMark(editor, markKey);
}

function handleBoldKeyEvent(event: React.KeyboardEvent, editor: Editor): void {
    if (isKeyMod(event) && event.key === 'b') {
        boldStrategy(editor)
    }
}

export const boldPlugin: ISlateLeafPlugin = {
    handleKeyEvent: handleBoldKeyEvent,
    render: renderBoldLeaf,
}