import {useCallback, useMemo, useRef, useState} from "react";
import {Slate, Editable, withReact, ReactEditor} from "slate-react";
import {BaseEditor, createEditor, Descendant, Editor} from "slate";
import {HistoryEditor, withHistory} from "slate-history";
import Button from "../../../theme/widgets/button/button";
import isHotkey from 'is-hotkey';

declare module 'slate' {
    interface CustomTypes {
        Editor: BaseEditor & ReactEditor & HistoryEditor
    }
}

const initialValue: Descendant[] = [
    {
        children: [
            { text: 'This is editable plain text, just like a <textarea>!' },
        ],
    },
]

const HOTKEYS:Record<string, string> = {
    'mod+b': 'bold',
    'mod+i': 'italic',
    'mod+u': 'underline',
    'mod+`': 'code',
}

const LIST_TYPES:string[] = ['numbered-list', 'bulleted-list']
const TEXT_ALIGN_TYPES:string[] = ['left', 'center', 'right', 'justify']

export function RichTextEditView() {

    const editorRef = useRef<Editor>()
    if (!editorRef.current) {
        editorRef.current = withHistory(withReact(createEditor()))
    }
    const editor = editorRef.current
    const [value, setValue] = useState<Descendant[]>(initialValue)
    const renderElement = useCallback(props => <Element {...props} />, [])
    const renderLeaf = useCallback(props => <Leaf {...props} />, [])

    return (
        <div className={'flex-fill d-flex flex-column'}>
            <div className={'d-flex h-gap-3 py-4 px-5'}>
                <Button text={'Bold'} onClick={() => toggleMark(editor, 'bold')}/>
                <Button text={'Italic'} onClick={() => toggleMark(editor, 'italic')}/>
                <Button text={'Underline'} onClick={() => toggleMark(editor, 'underline')}/>
            </div>
            <div className={'flex-fill d-flex position-relative'}>
                <div className={'position-absolute w-100 h-100 overflow-auto px-5 py-5'}>
                    <div className={'bg-primary'}>
                        <div className={'text-secondary p-4'}>
                            <Slate
                                editor={editor}
                                value={value}
                                onChange={setValue}>
                                <Editable
                                    className={'unreset'}
                                    renderElement={renderElement}
                                    renderLeaf={renderLeaf}
                                    spellCheck={false}
                                    autoFocus={true}
                                    onKeyDown={event => {
                                        for (const hotkey in HOTKEYS) {
                                            if (isHotkey(hotkey, event as any)) {
                                                event.preventDefault()
                                                const mark = HOTKEYS[hotkey]
                                                toggleMark(editor, mark)
                                            }
                                        }
                                    }}/>
                            </Slate>
                        </div>
                    </div>


                </div>
            </div>
        </div>
    )
}

function toggleMark (editor: Editor, format: string) {
    const isActive = isMarkActive(editor, format)

    if (isActive) {
        Editor.removeMark(editor, format)
    } else {
        Editor.addMark(editor, format, true)
    }
}

function isMarkActive (editor: Editor, format:string) {
    const marks = Editor.marks(editor) as Record<string, boolean>
    return marks ? marks[format] : false
}

type ElementProps = {
    attributes: any,
    children: JSX.Element,
    element: {
        type: string
        align: 'left' | 'center' | 'right' | 'justify'
    }
}

function Element (props: ElementProps) {

    const {attributes, children, element } = props;

    const style = { textAlign: element.align }
    switch (element.type) {
        case 'block-quote':
            return (
                <blockquote style={style} {...attributes}>
                    {children}
                </blockquote>
            )
        case 'bulleted-list':
            return (
                <ul style={style} {...attributes}>
                    {children}
                </ul>
            )
        case 'heading-one':
            return (
                <h1 style={style} {...attributes}>
                    {children}
                </h1>
            )
        case 'heading-two':
            return (
                <h2 style={style} {...attributes}>
                    {children}
                </h2>
            )
        case 'list-item':
            return (
                <li style={style} {...attributes}>
                    {children}
                </li>
            )
        case 'numbered-list':
            return (
                <ol style={style} {...attributes}>
                    {children}
                </ol>
            )
        default:
            return (
                <p style={style} {...attributes}>
                    {children}
                </p>
            )
    }
}

type LeafProps = {
    attributes: any[],
    children: JSX.Element,
    leaf: {
        bold: boolean,
        code: boolean,
        italic: boolean,
        underline: boolean
    }
}

function Leaf( props: LeafProps) {

    const { attributes, leaf } = props;
    let children = props.children;

    if (leaf.bold) {
        children = <strong>{children}</strong>
    }

    if (leaf.code) {
        children = <code>{children}</code>
    }

    if (leaf.italic) {
        children = <em>{children}</em>
    }

    if (leaf.underline) {
        children = <u>{children}</u>
    }

    return <span {...attributes}>{children}</span>
}
