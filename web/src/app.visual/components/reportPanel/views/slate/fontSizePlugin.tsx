import {FontSizeInputProps, ISlateLeafPlugin, LeafProps, LeafType} from "./slateModel";
import React from "react";
import {ReactEditor, useSlate} from "slate-react";
import ComboBox from "../../../../theme/widgets/comboBox/comboBox";
import {Editor} from "slate";
import {getMarkValue, setMark} from "./slate-utils";

const markKey = 'fontSize';
const defaultMarkValue = '12';

function renderFontSizeLeaf(leaf: LeafType, children: any) {
    let result = children;

    if (leaf.fontSize) {
        const style = {
            fontSize: parseInt(leaf.fontSize) || parseInt(defaultMarkValue) || 12,
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
    setMark(editor, markKey, value);
}


function getFontSizeMark (editor: Editor) {
    return getMarkValue(editor, markKey, defaultMarkValue);
}

export const fontSizePlugin: ISlateLeafPlugin = {
    render: renderFontSizeLeaf,
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