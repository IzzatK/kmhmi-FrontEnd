import {BaseEditor, BaseElement, Editor} from "slate";
import {ReactEditor, RenderLeafProps} from "slate-react";
import {HistoryEditor} from "slate-history";
import {ButtonProps} from "../../../../theme/widgets/button/buttonModel";
import {RenderElementProps} from "slate-react/dist/components/editable";
import {Nullable} from "../../../../../framework.core/extras/utils/typeUtils";
import React from "react";

declare module 'slate' {
    interface CustomTypes {
        Editor: BaseEditor & ReactEditor & HistoryEditor
    }
}

export type ElementType = BaseElement & {
    type: string
    align: TEXT_ALIGN_TYPE | undefined
    // list: LIST_TYPE | undefined
}

export type LeafType = {
    bold: boolean,
    code: boolean,
    italic: boolean,
    underline: boolean
    fontSize: string,
    fontFamily: string,
    fontColor: string,
    fontHighlight: string,
    superscript: boolean,
    subscript: boolean,
}

export type ElementProps = RenderElementProps & {
    children: ElementType[],
    element: ElementType
}

export type LeafProps = RenderLeafProps & {
    attributes: any[],
    leaf: LeafType
}

export type SlateEditorProps = {
    onChange: (value: any) => void;
}

export type SlateEditorState = {

}

export enum LIST_TYPE {
    'numbered'='numbered',
    'bulleted'='bulleted'
}
export enum TEXT_ALIGN_TYPE {
    'left'='left',
    'center'='center',
    'right'='right',
    'justify'='justify'
}

export type FontSizeInputProps = {

}

export type FontFamilyInputProps = {

}

export type HighlightColorInputProps = {

}

export type FontColorInputProps = {

}

export type BoldInputProps = {

}

export type ItalicInputProps = {

}

export type UnderlineInputProps = {

}

export type SuperscriptInputProps = {

}

export type SubscriptInputProps = {

}

export type TextAlignInputButtonProps = ButtonProps & {
    align: TEXT_ALIGN_TYPE;
}

export type TextAlignInputToolbarProps = {

}

export type ListInputButtonProps = ButtonProps &{
    list: LIST_TYPE
}

export type ListInputToolbarProps = {

}

export type BlockButtonProps = ButtonProps & {
    format: string
}

export interface ISlatePlugin<T> {
    handleKeyEvent?: (event: React.KeyboardEvent, editor: Editor) => void,
    render?: (node: T, children: any, attributes?: any) => any;
}

export interface ISlateLeafPlugin extends ISlatePlugin<LeafType>{

}

export interface ISlateElementPlugin extends ISlatePlugin<ElementType>{

}
