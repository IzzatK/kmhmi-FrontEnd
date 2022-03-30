import {BoldInputProps, FontFamilyInputProps, KeyEventHandler, LeafProps, LeafType} from "./slateModel";
import React from "react";
import {useSlate} from "slate-react";
import ComboBox from "../../../../theme/widgets/comboBox/comboBox";
import {Editor} from "slate";
import Button from "../../../../theme/widgets/button/button";
import {TextFormatBoldSVGD} from "../../../../theme/svgs/textFormatBoldSVG";
import {isKeyMod} from "./slate-utils";
import {Nullable} from "../../../../../framework.core/extras/utils/typeUtils";

const markKey = 'bold';

export function renderBoldLeaf(leaf: LeafType, children: any) {
    let result = children;

    if (leaf.bold) {
        result = <strong>{result}</strong>
    }

    return result;
}

export function BoldInput(props: BoldInputProps) {
    const editor = useSlate();

    function _onSelect() {
        boldStrategy(editor);
    }

    return (
        <Button className={'btn-transparent'} onClick={_onSelect} selected={hasBoldMark(editor)}>
            <TextFormatBoldSVGD className={'small-image-container'}/>
        </Button>
    )
}

function boldStrategy(editor: Editor) {
    if (hasBoldMark(editor)) {
        editor.removeMark(markKey);
    }
    else {
        editor.addMark(markKey, true);
    }
}

function hasBoldMark (editor: Editor) {
    const marks = Editor.marks(editor) as Record<string, boolean>
    return marks ? marks[markKey] : false
}

export function handleBoldKeyEvent(event: React.KeyboardEvent, editor: Editor): KeyEventHandler {
    let handler = null;

    if (isKeyMod(event) && event.key === 'b') {
        handler = () => boldStrategy(editor)
    }

    return handler;
}