import {BoldInputProps, FontFamilyInputProps, LeafProps, LeafType} from "./slateModel";
import React from "react";
import {useSlate} from "slate-react";
import ComboBox from "../../../../theme/widgets/comboBox/comboBox";
import {Editor} from "slate";
import Button from "../../../../theme/widgets/button/button";
import {TextFormatBoldSVGD} from "../../../../theme/svgs/textFormatBoldSVG";

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
        if (hasBoldMark(editor)) {
            boldStrategy(editor, false);
        }
        else {
            boldStrategy(editor, true);
        }
    }

    return (
        <Button className={'btn-transparent'} onClick={_onSelect} selected={hasBoldMark(editor)}>
            <TextFormatBoldSVGD className={'small-image-container'}/>
        </Button>
    )
}

function boldStrategy(editor: Editor, value: any) {
    editor.removeMark(markKey);
    editor.addMark(markKey, value);
}

function hasBoldMark (editor: Editor) {
    const marks = Editor.marks(editor) as Record<string, boolean>
    return marks ? marks[markKey] : false
}