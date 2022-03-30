import {
    BoldInputProps,
    ElementType,
    FontFamilyInputProps,
    ISlateLeafPlugin,
    KeyEventHandler,
    LeafProps,
    LeafType
} from "./slateModel";
import React from "react";
import {ReactEditor, useSlate} from "slate-react";
import ComboBox from "../../../../theme/widgets/comboBox/comboBox";
import {Editor} from "slate";
import Button from "../../../../theme/widgets/button/button";
import {TextFormatBoldSVGD} from "../../../../theme/svgs/textFormatBoldSVG";
import {hasMark, isKeyMod, toggleMark} from "./slate-utils";
import {Nullable} from "../../../../../framework.core/extras/utils/typeUtils";

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

function handleBoldKeyEvent(event: React.KeyboardEvent, editor: Editor): KeyEventHandler {
    let handler = null;

    if (isKeyMod(event) && event.key === 'b') {
        handler = () => boldStrategy(editor)
    }

    return handler;
}

export const boldPlugin: ISlateLeafPlugin = {
    handleKeyEvent: handleBoldKeyEvent,
    render: renderBoldLeaf,
}