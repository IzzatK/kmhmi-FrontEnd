import {FontFamilyInputProps, ISlateLeafPlugin, LeafProps, LeafType} from "./slateModel";
import React from "react";
import {ReactEditor, useSlate} from "slate-react";
import ComboBox from "../../../../theme/widgets/comboBox/comboBox";
import {Editor} from "slate";
import {getMarkValue, hasMark, setMark} from "./slate-utils";

const markKey = 'fontFamily';
const defaultMarkValue = 'Open Sans';

function renderFontFamilyLeaf(leaf: LeafType, children: any) {
    let result = children;

    if (leaf.fontFamily) {
        const style = {
            fontFamily: leaf.fontFamily || defaultMarkValue
        }

        result = <span style={style}>{result}</span>
    }

    return result;
}

export function FontFamilyInput(props: FontFamilyInputProps) {
    const editor = useSlate();

    function _onSelect(id: string) {
        fontFamilyStrategy(editor, id);
    }

    return <ComboBox title={getFontFamilyMark(editor)} className={'font-family'} items={options} onSelect={_onSelect}/>
}

function fontFamilyStrategy(editor: Editor, value: string) {
    setMark(editor, markKey, value)
}

function hasFontFamilyMark (editor: Editor) {
    return hasMark(editor, markKey);
}

function getFontFamilyMark (editor: Editor) {
    return getMarkValue(editor, markKey, defaultMarkValue);
}

export const fontFamilyPlugin: ISlateLeafPlugin = {
    render: renderFontFamilyLeaf,
}

const options = [
    {
        id: 'Open Sans',
        style: {
            fontFamily: 'Open Sans'
        }
    },
    {
        id: 'Bookman Old Style',
        style: {
            fontFamily: 'Bookman Old Style'
        }
    },
    {
        id: 'Franklin Gothic',
        style: {
            fontFamily: 'Franklin Gothic'
        }
    },
    {
        id: 'Gadugi',
        style: {
            fontFamily: 'Gadugi'
        }
    },
    {
        id: 'Lucida Console',
        style: {
            fontFamily: 'Lucida Console'
        }
    },
    {
        id: 'Platino Linotype',
        style: {
            fontFamily: 'Platino Linotype'
        }
    }
]