import {ItalicInputProps, LeafType} from "./slateModel";
import React from "react";
import {useSlate} from "slate-react";
import {Editor} from "slate";
import Button from "../../../../theme/widgets/button/button";
import {TextFormatItalicSVG} from "../../../../theme/svgs/textFormatItalicSVG";

const markKey = 'italic';

export function renderItalicLeaf(leaf: LeafType, children: any) {
    let result = children;

    if (leaf.italic) {
        result = <i>{result}</i>
    }

    return result;
}

export function ItalicInput(props: ItalicInputProps) {
    const editor = useSlate();

    function _onSelect() {
        if (hasItalicMark(editor)) {
            italicStrategy(editor, false);
        }
        else {
            italicStrategy(editor, true);
        }
    }

    return (
        <Button className={'btn-transparent'} onClick={_onSelect} selected={hasItalicMark(editor)}>
            <TextFormatItalicSVG className={'small-image-container'}/>
        </Button>
    )
}

function italicStrategy(editor: Editor, value: any) {
    editor.removeMark(markKey);
    editor.addMark(markKey, value);
}

function hasItalicMark (editor: Editor) {
    const marks = Editor.marks(editor) as Record<string, boolean>
    return marks ? marks[markKey] : false
}