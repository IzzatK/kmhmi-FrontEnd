import {FontSizeInputProps, LeafProps, LeafType} from "./slateModel";
import React from "react";
import {useSlate} from "slate-react";
import ComboBox from "../../../../theme/widgets/comboBox/comboBox";
import {Editor} from "slate";
import {getMarkValue} from "./slate-utils";

const markKey = 'fontSize';
const defaultMarkValue = '12';

export function renderFontSizeLeaf(leaf: LeafType, children: any) {
    let result = children;

    if (leaf.fontSize) {
        const style = {
            fontSize: parseInt(leaf.fontSize) || 12,
        }

        result = <span style={style}>{result}</span>
    }

    return result;
}

export function FontSizeInput(props: FontSizeInputProps) {
    const editor = useSlate();

    function _onSelect(id: string) {
        fontSizeStrategy(editor, id);
    }

    return <ComboBox title={getFontSizeMark(editor)} className={'font-size'} items={options} onSelect={_onSelect}/>
}

function fontSizeStrategy(editor: Editor, value: string) {
    editor.removeMark('fontSize')
    editor.addMark('fontSize', value);
}

function hasFontSizeMark (editor: Editor) {
    const marks = Editor.marks(editor) as Record<string, boolean>
    return marks ? marks['fontSize'] : false
}

function getFontSizeMark (editor: Editor) {
    return getMarkValue(editor, markKey, defaultMarkValue);
}

const options = [
    {
        id: '12',
    },
    {
        id: '14',
    },
    {
        id: '16',
    },
    {
        id: '18',
    },
    {
        id: '20',
    },
    {
        id: '22',
    },
    {
        id: '24',
    }
]