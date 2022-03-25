import {BaseEditor} from "slate";
import {ReactEditor} from "slate-react";
import {HistoryEditor} from "slate-history";

declare module 'slate' {
    interface CustomTypes {
        Editor: BaseEditor & ReactEditor & HistoryEditor
    }
}

export type NodeProps = {
    attributes: any[],
    children: JSX.Element,
    element: {
        type: string
        align: 'left' | 'center' | 'right' | 'justify'
    }
}

export type MarkProps = {
    attributes: any[],
    children: JSX.Element,
    leaf: {
        bold: boolean,
        code: boolean,
        italic: boolean,
        underline: boolean
    }
}