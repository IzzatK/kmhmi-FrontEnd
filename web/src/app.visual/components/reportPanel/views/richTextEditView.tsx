import React, {useCallback, useRef, useState} from "react";
import {Editable, RenderElementProps, Slate, useSlate, withReact,} from "slate-react";
import {createEditor, Descendant, Editor, Element as SlateElement, Transforms} from "slate";
import {withHistory} from "slate-history";
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
import {
    BlockButtonProps,
    ElementProps,
    ElementType, FontColorInputProps, FontFamilyInputProps,
    FontSizeInputProps, HighlightColorInputProps,
    LeafProps,
    LIST_TYPE,
    TEXT_ALIGN_TYPE
} from "./slate/slateModel";
import Portal from "../../../theme/widgets/portal/portal";

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


const FONT_FAMILIES = [
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

const FONT_SIZES = [
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

export function RichTextEditView() {

    const editorRef = useRef<Editor>()
    if (!editorRef.current) {
        editorRef.current =
            withHistory(
            withReact(createEditor()))
    }
    const editor = editorRef.current
    const [value, setValue] = useState<Descendant[]>(initialValue)
    const renderElement = useCallback(props => <Element {...props} />, [])
    const renderLeaf = useCallback(props => <Leaf {...props} />, [])

    return (
        <Slate
            editor={editor}
            value={value}
            onChange={setValue}>
            <div className={'flex-fill d-flex flex-column v-gap-3 p-5'}>
                <div className={'toolbar d-flex flex-column v-gap-3'}>
                    <div className={'toolbar flex-fill d-flex h-gap-5'}>
                        <div className={'d-flex h-gap-3'}>
                            <FontFamilyInput/>
                            <FontSizeInput />
                        </div>
                        <div className={'d-flex h-gap-2'}>
                            <BlockButton format={'left'}>
                                <TextAlignLeftSVG className={'small-image-container'}/>
                            </BlockButton>
                            <BlockButton format={'center'}>
                                <TextAlignCenterSVG className={'small-image-container'}/>
                            </BlockButton>
                            <BlockButton format={'right'}>
                                <TextAlignRightSVG className={'small-image-container'}/>
                            </BlockButton>
                            <BlockButton format={'justify'}>
                                <TextAlignJustifySVG className={'small-image-container'}/>
                            </BlockButton>
                        </div>
                        <div className={'d-flex h-gap-2'}>
                            <BlockButton format={'numbered-list'}>
                                <TextListNumber className={'small-image-container'}/>
                            </BlockButton>
                            <BlockButton format={'bulleted-list'}>
                                <TextListBulletSVG className={'small-image-container'}/>
                            </BlockButton>
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
                            <HighlightColorInput/>
                            {/*<Button className={'btn-transparent border-bottom border-accent rounded-0'} onClick={() => toggleMarkFormat(editor, 'highlight')}>*/}
                            {/*    <TextFormatHighlightSVG className={'small-image-container'}/>*/}
                            {/*</Button>*/}
                            <FontColorInput/>
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
                                                    if (isHotkey(hotkey, event)) {
                                                        event.preventDefault()
                                                        const mark = HOTKEYS[hotkey]
                                                        toggleMarkFormat(editor, mark)
                                                    }
                                                }
                                            }
                                        }}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Slate>
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

function isListType(format: string): boolean {
    let result = false;

    if (format in LIST_TYPE) {
        result = true;
    }

    // result = Object.values(LIST_TYPE)?.includes(format as LIST_TYPE);

    return result;
}

function isTextAlignType(format: string): boolean {
    let result = false;

    if (format in TEXT_ALIGN_TYPE) {
        result = true;
    }

    // result = Object.values(TEXT_ALIGN_TYPE)?.includes(format as TEXT_ALIGN_TYPE);

    return result;
}

const toggleBlock = (editor: Editor, format: string) => {
    const isActive = isBlockActive(
        editor,
        format,
        isTextAlignType(format) ? 'align' : 'type'
    )
    const isList = isListType(format)

    Transforms.unwrapNodes(editor, {
        match: (n) =>
            !Editor.isEditor(n) &&
            SlateElement.isElement(n) &&
            isListType((n as ElementType).type) &&
            !isTextAlignType(format),
        split: true,
    })
    let element: Partial<ElementType>;
    if (isTextAlignType(format)) {
        element = {
            align: isActive ? undefined : format as TEXT_ALIGN_TYPE,
        }
    } else {
        element = {
            type: isActive ? 'paragraph' : isList ? 'list-item' : format,
        }
    }
    Transforms.setNodes<ElementType>(editor, element)

    if (!isActive && isList) {
        const block = { type: format, children: [] }
        Transforms.wrapNodes(editor, block)
    }
}

function isMarkActive (editor: Editor, format:string) {
    const marks = Editor.marks(editor) as Record<string, boolean>
    return marks ? marks[format] : false
}

function FontFamilyInput(props: FontFamilyInputProps) {
    const editor = useSlate();

    function _onSelect(id: string) {
        editor.removeMark('fontFamily')
        editor.addMark('fontFamily', id);
    }

    return <ComboBox title={'Open Sans'} className={'font-family'} items={FONT_FAMILIES} onSelect={_onSelect}/>
}

function FontSizeInput(props: FontSizeInputProps) {
    const editor = useSlate();

    function _onSelect(id: string) {
        editor.removeMark('fontSize')
        editor.addMark('fontSize', id);

        // Transforms.setNodes<ElementType>(editor, {
        //     fontSize: id
        // })
    }

    return <ComboBox title={'16'} className={'font-size'} items={FONT_SIZES} onSelect={_onSelect}/>
}

function HighlightColorInput(props: HighlightColorInputProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [color, setColor] = useState('yellow');
    const editor = useSlate();

    function _onSelect(id: string) {
        editor.removeMark('highlightColor')

        const nextColor: string = id === color ? 'transparent': id;

        setColor(nextColor);
        editor.addMark('highlightColor', nextColor);

        setIsOpen(false);
    }

    function _onClickHandler() {
        if (isOpen) {
            setIsOpen(false);
        }
        else {
            setIsOpen(true);
        }
    }

    return (
        <div>
            <Portal
                isOpen={isOpen}
                zIndex={9999}
                enterClass={'growVertical'}
                exitClass={'shrinkVertical'}
                timeout={200}
                autoLayout={false}
                onShouldClose={_onClickHandler}
                portalContent={(relatedWidth: any) => {
                    return (
                            <div className={`shadow d-flex h-gap-3 p-3 bg-muted mt-2`}>
                                <div className={'p-4'} style={{backgroundColor: 'yellow'}} onClick={() => _onSelect('yellow')}/>
                                <div className={'p-4'} style={{backgroundColor: 'green'}} onClick={() => _onSelect('green')}/>
                                <div className={'p-4'} style={{backgroundColor: 'blue'}} onClick={() => _onSelect('blue')}/>
                                <div className={'p-4'} style={{backgroundColor: 'pink'}} onClick={() => _onSelect('pink')}/>
                            </div>
                        )
                }}>
                <div tabIndex={0}>
                    <Button className={'btn-transparent rounded-0'} style={{borderBottom: `0.1rem solid ${color}`}} onClick={() => _onClickHandler()}>
                        <TextFormatHighlightSVG className={'small-image-container'}/>
                    </Button>
                </div>
            </Portal>
        </div>
    )
}

function FontColorInput(props: FontColorInputProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [color, setColor] = useState('black');
    const editor = useSlate();

    function _onSelect(id: string) {
        editor.removeMark('fontColor')

        const nextColor: string = id === color ? 'black': id;

        setColor(nextColor);
        editor.addMark('fontColor', nextColor);

        setIsOpen(false);
    }

    function _onClickHandler() {
        if (isOpen) {
            setIsOpen(false);
        }
        else {
            setIsOpen(true);
        }
    }

    return (
        <div>
            <Portal
                isOpen={isOpen}
                zIndex={9999}
                enterClass={'growVertical'}
                exitClass={'shrinkVertical'}
                timeout={200}
                autoLayout={false}
                onShouldClose={_onClickHandler}
                portalContent={(relatedWidth: any) => {
                    return (
                        <div className={`shadow d-flex h-gap-3 p-3 bg-muted mt-2`}>
                            <div className={'p-4'} style={{backgroundColor: 'yellow'}} onClick={() => _onSelect('yellow')}/>
                            <div className={'p-4'} style={{backgroundColor: 'red'}} onClick={() => _onSelect('red')}/>
                            <div className={'p-4'} style={{backgroundColor: 'darkgray'}} onClick={() => _onSelect('darkgray')}/>
                            <div className={'p-4'} style={{backgroundColor: 'gray'}} onClick={() => _onSelect('gray')}/>
                            <div className={'p-4'} style={{backgroundColor: 'orange'}} onClick={() => _onSelect('orange')}/>
                            <div className={'p-4'} style={{backgroundColor: 'lightblue'}} onClick={() => _onSelect('lightblue')}/>
                            <div className={'p-4'} style={{backgroundColor: 'black'}} onClick={() => _onSelect('black')}/>
                            <div className={'p-4'} style={{backgroundColor: 'darkmagenta'}} onClick={() => _onSelect('darkmagenta')}/>
                        </div>
                    )
                }}>
                <div tabIndex={0}>
                    <Button className={'btn-transparent rounded-0'} style={{borderBottom: `0.1rem solid ${color}`}} onClick={() => _onClickHandler()}>
                        <TextFormatColorSVG className={'small-image-container'}/>
                    </Button>
                </div>
            </Portal>
        </div>
    )
}

function BlockButton(props: BlockButtonProps) {
    const editor = useSlate();

    const {format, onClick, ...rest} = props;

    const selected = isBlockActive(
            editor,
            props.format,
            isTextAlignType(props.format) ? 'align' : 'type');

    return <Button className={'btn-transparent'} {...rest} selected={selected} onClick={
        event => {
            event.preventDefault()
            toggleBlock(editor, format)
        }
    }>
        {props.children}
    </Button>
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

function Element (props: ElementProps) {

    const {attributes, children, element } = props;

    const style = {
        textAlign: element.align || TEXT_ALIGN_TYPE.left,
    }

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

function Leaf( props: LeafProps) {

    const { attributes, leaf } = props;
    let children = props.children;

    const style = {
        fontSize: parseInt(leaf.fontSize) || 12,
        fontFamily: leaf.fontFamily || '',
        backgroundColor: leaf.highlightColor || '',
        color: leaf.fontColor || 'black'
    }


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

    return <span style={style} {...attributes}>{children}</span>
}
