import {FontFamilyInputProps, LeafProps, LeafType} from "./slateModel";
import React from "react";
import {useSlate} from "slate-react";
import ComboBox from "../../../../theme/widgets/comboBox/comboBox";
import {Editor} from "slate";

const markKey = 'fontFamily';
const defaultMarkValue = 'Open Sans';

export function renderFontFamilyLeaf(leaf: LeafType, children: any) {
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
    editor.removeMark('fontFamily')
    editor.addMark('fontFamily', value);
}

function hasFontFamilyMark (editor: Editor) {
    const marks = Editor.marks(editor) as Record<string, boolean>
    return marks ? marks['fontFamily'] : false
}

function getFontFamilyMark (editor: Editor) {
    const marks = Editor.marks(editor) as Record<string, string>
    return marks[markKey] ? marks[markKey] : defaultMarkValue;
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