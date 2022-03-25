import {useCallback, useMemo, useRef, useState} from "react";
import {Slate, Editable, withReact, ReactEditor} from "slate-react";
import {BaseEditor, createEditor, Descendant, Editor, Element as SlateElement, Transforms,} from "slate";
import {HistoryEditor, withHistory} from "slate-history";
import Button from "../../../theme/widgets/button/button";
import isHotkey from 'is-hotkey';
import {TextFormatBoldSVGD} from "../../../theme/svgs/textFormatBoldSVG";
import {TextFormatItalicSVG} from "../../../theme/svgs/textFormatItalicSVG";
import {TextFormatUnderlineSVG} from "../../../theme/svgs/textFormatUnderlineSVG";
import {TextFormatHighlightSVG} from "../../../theme/svgs/textFormatHighlightSVG";
import {TextFormatColorSVG} from "../../../theme/svgs/textFormatColorSVG";
import ComboBox from "../../../theme/widgets/comboBox/comboBox";
import {TextAlignLeftSVG} from "../../../theme/svgs/textAlignLeftSVG";
import {TextAlignCenterSVG} from "../../../theme/svgs/textAlignCenterSVG";
import {TextAlignRightSVG} from "../../../theme/svgs/textAlignRightSVG";
import {TextAlignJustifySVG} from "../../../theme/svgs/textAlignJustifySVG";
import {TextListNumber} from "../../../theme/svgs/textListNumber";
import {TextListBulletSVG} from "../../../theme/svgs/textListBulletSVG";

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

const citation = [
    {
        id: 'mla',
        title: 'MLA',
    },
    {
        id: 'chicago',
        title: 'Chicago'
    }
]


const fonts = [
    {
        id: 'open-sans',
        title: 'Open Sans',
    },
    {
        id: 'roboto',
        title: 'Roboto'
    }
]

const sizes = [
    {
        id: 'font-12',
        title: '12',
    },
    {
        id: 'font-14',
        title: '14'
    },
    {
        id: 'font-16',
        title: '16'
    },
    {
        id: 'font-18',
        title: '18'
    },
    {
        id: 'font-20',
        title: '20'
    }
]

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
        <div className={'flex-fill d-flex flex-column v-gap-3 p-5'}>
            <div className={'toolbar d-flex flex-column v-gap-3'}>
                <div className={'toolbar flex-fill d-flex h-gap-5'}>
                    <div className={'d-flex h-gap-3'}>
                        <ComboBox items={fonts} />
                        <ComboBox className={'font-size'} items={sizes} />
                    </div>
                    <div className={'d-flex h-gap-2'}>
                        <Button className={'btn-transparent'} onClick={() => toggleMarkFormat(editor, 'text-align-left')}>
                            <TextAlignLeftSVG className={'small-image-container'}/>
                        </Button>
                        <Button className={'btn-transparent'} onClick={() => toggleMarkFormat(editor, 'text-align-left')}>
                            <TextAlignCenterSVG className={'small-image-container'}/>
                        </Button>
                        <Button className={'btn-transparent'} onClick={() => toggleMarkFormat(editor, 'text-align-left')}>
                            <TextAlignRightSVG className={'small-image-container'}/>
                        </Button>
                        <Button className={'btn-transparent'} onClick={() => toggleMarkFormat(editor, 'text-align-left')}>
                            <TextAlignJustifySVG className={'small-image-container'}/>
                        </Button>
                    </div>
                    <div className={'d-flex h-gap-2'}>
                        <Button className={'btn-transparent'} onClick={() => toggleMarkFormat(editor, 'bold')}>
                            <TextListNumber className={'small-image-container'}/>
                        </Button>
                        <Button className={'btn-transparent'} onClick={() => toggleMarkFormat(editor, 'bold')}>
                            <TextListBulletSVG className={'small-image-container'}/>
                        </Button>
                    </div>
                </div>
                <div className={'align-self-stretch d-flex justify-content-between'}>
                    <div className={'d-flex h-gap-3'}>
                        <Button className={'btn-transparent'} onClick={() => toggleMarkFormat(editor, 'bold')} selected={isMarkActive(editor, 'bold')}>
                            <TextFormatBoldSVGD className={'small-image-container'}/>
                        </Button>
                        <Button className={'btn-transparent'} onClick={() => toggleMarkFormat(editor, 'italic')} selected={isMarkActive(editor, 'italic')}>
                            <TextFormatItalicSVG className={'small-image-container'}/>
                        </Button>
                        <Button className={'btn-transparent'} onClick={() => toggleMarkFormat(editor, 'underline')} selected={isMarkActive(editor, 'underline')}>
                            <TextFormatUnderlineSVG className={'small-image-container'}/>
                        </Button>
                        <Button className={'btn-transparent border-bottom border-accent rounded-0'} onClick={() => toggleMarkFormat(editor, 'highlight')}>
                            <TextFormatHighlightSVG className={'small-image-container'}/>
                        </Button>
                        <Button className={'btn-transparent'} onClick={() => toggleMarkFormat(editor, 'color')}>
                            <TextFormatColorSVG className={'small-image-container'}/>
                        </Button>
                    </div>
                    <div className={'d-flex'}>
                        <ComboBox items={citation} />
                    </div>
                </div>
            </div>

            <div className={'flex-fill d-flex position-relative h-100'}>
                <div className={'position-absolute w-100 h-100 overflow-auto pr-4 pt-4'}>
                    <div className={'bg-primary h-100'}>
                        <div className={'text-secondary h-100'}>
                            <Slate
                                editor={editor}
                                value={value}
                                onChange={setValue}>
                                <Editable
                                    className={'unreset h-100'}
                                    renderElement={renderElement}
                                    renderLeaf={renderLeaf}
                                    spellCheck={false}
                                    autoFocus={true}
                                    onKeyDown={event => {
                                        if (event.key.toUpperCase() === 'TAB') {
                                            // Prevent the ampersand character from being inserted.
                                            event.preventDefault()
                                            // Execute the `insertText` method when the event occurs.
                                            editor.insertText('    ')
                                        }
                                        else {
                                            for (const hotkey in HOTKEYS) {
                                                if (isHotkey(hotkey, event as any)) {
                                                    event.preventDefault()
                                                    const mark = HOTKEYS[hotkey]
                                                    toggleMarkFormat(editor, mark)
                                                }
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

function toggleMarkFormat (editor: Editor, format: string) {
    const isActive = isMarkActive(editor, format)

    if (isActive) {
        Editor.removeMark(editor, format)
    } else {
        Editor.addMark(editor, format, true)
    }
}

// function toggleNodeFormat(editor: Editor, format: string) {
//     const isActive = isBlockActive(
//         editor,
//         format,
//         TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
//     )
//     const isList = LIST_TYPES.includes(format)
//
//     Transforms.unwrapNodes(editor, {
//         match: (n) =>
//             !Editor.isEditor(n) &&
//             SlateElement.isElement(n) &&
//             LIST_TYPES.includes(n.type) &&
//             !TEXT_ALIGN_TYPES.includes(format),
//         split: true,
//     })
//     let newProperties: Partial<SlateElement>
//     if (TEXT_ALIGN_TYPES.includes(format)) {
//         newProperties = {
//             align: isActive ? undefined : format,
//         }
//     } else {
//         newProperties = {
//             type: isActive ? 'paragraph' : isList ? 'list-item' : format,
//         }
//     }
//     Transforms.setNodes<SlateElement>(editor, newProperties)
//
//     if (!isActive && isList) {
//         const block = { type: format, children: [] }
//         Transforms.wrapNodes(editor, block)
//     }
// }

function setAlignment (editor: Editor, key: string, value: string) {
    Editor.addMark(editor, key, value);
}

function isMarkActive (editor: Editor, format:string) {
    const marks = Editor.marks(editor) as Record<string, boolean>
    return marks ? marks[format] : false
}

function isBlockActive (editor: Editor, format: any, blockType = 'type') {
    const { selection } = editor
    if (!selection) return false

    const [match] = Array.from(
        Editor.nodes(editor, {
            at: Editor.unhangRange(editor, selection),
            match: (n: any) => {

                const lookup: Record<string, string> = n;

                return !Editor.isEditor(n) &&
                    SlateElement.isElement(n) &&
                    lookup[blockType] === format;
            }

        })
    )

    return !!match
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
