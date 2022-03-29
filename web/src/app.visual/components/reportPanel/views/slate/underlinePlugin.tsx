import {LeafType, UnderlineInputProps} from "./slateModel";
import React from "react";
import {useSlate} from "slate-react";
import {Editor} from "slate";
import Button from "../../../../theme/widgets/button/button";
import {TextFormatUnderlineSVG} from "../../../../theme/svgs/textFormatUnderlineSVG";

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
        if (hasUnderlineMark(editor)) {
            underlineStrategy(editor, false);
        }
        else {
            underlineStrategy(editor, true);
        }
    }

    return (
        <Button className={'btn-transparent'} onClick={_onSelect} selected={hasUnderlineMark(editor)}>
            <TextFormatUnderlineSVG className={'small-image-container'}/>
        </Button>
    )
}

function underlineStrategy(editor: Editor, value: any) {
    editor.removeMark(markKey);
    editor.addMark(markKey, value);
}

function hasUnderlineMark (editor: Editor) {
    const marks = Editor.marks(editor) as Record<string, boolean>
    return marks ? marks[markKey] : false
}