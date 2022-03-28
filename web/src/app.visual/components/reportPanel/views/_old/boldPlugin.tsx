import Button from "../../../../theme/widgets/button/button";
import {ButtonProps} from "../../../../theme/widgets/button/buttonModel";
import React from "react";
import {Editor} from "slate";
import {LeafProps} from "../slate/slateModel";
import {isMod} from "./slate-utils";


export function BoldButton(props: ButtonProps) {
    return (
        <Button {...props}/>
    )
}


function hasMark (editor: Editor) {
    const marks = Editor.marks(editor) as Record<string, boolean>
    return marks ? marks['bold'] : false
}

function boldMarkStrategy (editor: Editor) {

    if (hasMark(editor)) {
        editor.removeMark('bold')
    }
    else {
        editor.addMark('bold', true);
    }

    return editor;
}

type BoldMarkProps = LeafProps & {

}

function BoldMark (props: BoldMarkProps) {
    return (
        <strong>
            {props.children}
        </strong>
    )
}

function BoldKeyboardShortcut(event: React.KeyboardEvent<HTMLDivElement>, change: any) {
    if (isMod(event) && event.key === 'b') return boldMarkStrategy(change)
    return
}

//
// const BoldPlugin = (options:any) => ({
//     onKeyDown(...args: any[]) {
//         return BoldKeyboardShortcut(...args)
//     },
// })