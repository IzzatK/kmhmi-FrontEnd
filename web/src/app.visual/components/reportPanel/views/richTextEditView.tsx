import React, {useCallback, useRef, useState} from "react";
import {Editable, Slate, withReact,} from "slate-react";
import {createEditor, Descendant, Editor } from "slate";
import {withHistory} from "slate-history";
import ComboBox from "../../../theme/widgets/comboBox/comboBox";
import {
    ElementProps,
    ISlateElementPlugin,
    ISlateLeafPlugin,
    LeafProps,
} from "./slate/slateModel";
import {FontFamilyInput, fontFamilyPlugin } from "./slate/fontFamilyPlugin";
import {FontHighlightInput, fontHighlightPlugin } from "./slate/fontHighlightPlugin";
import {FontColorInput, fontColorPlugin } from "./slate/fontColorPlugin";
import {BoldInput, boldPlugin } from "./slate/boldPlugin";
import {ItalicInput, italicPlugin } from "./slate/italicPlugin";
import {UnderlineInput, underlinePlugin } from "./slate/underlinePlugin";
import {FontSizeInput, fontSizePlugin } from "./slate/fontSizePlugin";
import {TextAlignInputToolbar, textAlignPlugin } from "./slate/textAlignPlugin";
import {ListInputToolbar, listPlugin } from "./slate/listPlugin";
import {forEach} from "../../../../framework.core/extras/utils/collectionUtils";

const initialValue: Descendant[] = [
    {
        children: [
            { text: 'This is editable plain text, just like a <textarea>!' },
        ],
    },
]

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

const slateLeafPlugins: ISlateLeafPlugin[] = [
    boldPlugin,
    fontColorPlugin,
    fontFamilyPlugin,
    fontHighlightPlugin,
    fontSizePlugin,
    italicPlugin,
    underlinePlugin
]

const slateElementPlugins: ISlateElementPlugin[] = [
    listPlugin,
    textAlignPlugin
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
                            <BoldInput />
                            <ItalicInput />
                            <UnderlineInput />
                            <FontHighlightInput />
                            <FontColorInput />
                        </div>
                        <div className={'d-flex'}>
                            <ComboBox items={citation} title={'MLA'}/>
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

                                        forEach(slateLeafPlugins, (plugin: ISlateLeafPlugin) => {
                                            if (plugin.handleKeyEvent) {
                                                plugin.handleKeyEvent(event, editor);
                                            }
                                        })
                                    }}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Slate>
    )
}

function Element (props: ElementProps) {

    const {attributes, element } = props;

    let children = props.children;

    forEach(slateElementPlugins, (plugin: ISlateElementPlugin) => {
        if (plugin.render) {
            children = plugin.render(element, children, attributes);
        }
    })

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

    forEach(slateLeafPlugins, (plugin: ISlateLeafPlugin) => {
        if (plugin.render) {
            children = plugin.render(leaf, children);
        }
    })

    return <span {...attributes}>{children}</span>;
}
