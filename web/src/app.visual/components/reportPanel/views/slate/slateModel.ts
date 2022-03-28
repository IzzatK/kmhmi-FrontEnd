import {BaseEditor} from "slate";
import {ReactEditor} from "slate-react";
import {HistoryEditor} from "slate-history";
import {ButtonProps} from "../../../../theme/widgets/button/buttonModel";

declare module 'slate' {
    interface CustomTypes {
        Editor: BaseEditor & ReactEditor & HistoryEditor
    }
}

export type ElementProps = {
    attributes: any[],
    children: JSX.Element,
    element: {
        type: string
        align: 'left' | 'center' | 'right' | 'justify'
    }
}

export type LeafProps = {
    attributes: any[],
    children: JSX.Element,
    leaf: {
        bold: boolean,
        code: boolean,
        italic: boolean,
        underline: boolean
        fontSize: string
    }
}

export type SlateEditorProps = {
    onChange: (value: any) => void;
}

export type SlateEditorState = {

}

export enum LIST_TYPE {
    'numbered-list'='numbered-list',
    'bulleted-list'='bulleted-list'
}
export enum TEXT_ALIGN_TYPE {
    'left'='left',
    'center'='center',
    'right'='right',
    'justify'='justify'
}

export type FontSizeInputProps = ButtonProps & {

}

export type BlockButtonProps = ButtonProps & {
    format: string
}