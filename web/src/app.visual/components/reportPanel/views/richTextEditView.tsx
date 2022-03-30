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
import {FontFamilyInput, renderFontFamilyLeaf} from "./slate/fontFamilyPlugin";
import {FontHighlightInput, renderFontHighlightLeaf} from "./slate/fontHighlightPlugin";
import {FontColorInput, renderFontColorLeaf} from "./slate/fontColorPlugin";
import {BoldInput, handleBoldKeyEvent, renderBoldLeaf} from "./slate/boldPlugin";
import {handleItalicKeyEvent, ItalicInput, renderItalicLeaf} from "./slate/italicPlugin";
import {handleUnderlineKeyEvent, renderUnderlineLeaf, UnderlineInput} from "./slate/underlinePlugin";
import {FontSizeInput, renderFontSizeLeaf} from "./slate/fontSizePlugin";
import {renderTextAlignElement, TextAlignInputToolbar} from "./slate/textAlignPlugin";
import {ListInputToolbar, renderListElement} from "./slate/listPlugin";

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
                            <FontFamilyInput />
                            <FontSizeInput />
                        </div>
                        <TextAlignInputToolbar />
                        <ListInputToolbar />
                    </div>
                    <div className={'align-self-stretch d-flex justify-content-between'}>
                        <div className={'d-flex h-gap-3'}>
                            <BoldInput/>
                            <ItalicInput/>
                            <UnderlineInput/>
                            <FontHighlightInput/>
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
                                        className={'unreset h-100 p-3'}
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
                                                let handler =            handleBoldKeyEvent(event, editor);
                                                    handler = handler ?? handleItalicKeyEvent(event, editor);
                                                    handler = handler ?? handleUnderlineKeyEvent(event, editor);

                                                if (handler != null) {
                                                    event.preventDefault()
                                                    handler();
                                                    
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

function handleHotKey(event: React.KeyboardEvent) {
    event.preventDefault()
}

function Element (props: ElementProps) {

    const {attributes, element } = props;

    let children = props.children;

    children = renderTextAlignElement(element, children, attributes);
    children = renderListElement(element, children, attributes);

    // default to rendering with a paragraph
    if (children == props.children) {
        children = (
            <p {...attributes}>
                {children}
            </p>
        )
    }

    return children;
}

function Leaf( props: LeafProps) {
    const { attributes, leaf } = props;

    let children = props.children;

    children = renderFontSizeLeaf(leaf, children);
    children = renderFontFamilyLeaf(leaf, children);
    children = renderFontColorLeaf(leaf, children);
    children = renderFontHighlightLeaf(leaf, children);
    children = renderBoldLeaf(leaf, children);
    children = renderItalicLeaf(leaf, children);
    children = renderUnderlineLeaf(leaf, children);

    return <span {...attributes}>{children}</span>;
}
