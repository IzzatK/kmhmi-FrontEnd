import React, {useCallback, useRef} from "react";
import {Editable, Slate, withReact,} from "slate-react";
import {createEditor, Editor, Transforms} from "slate";
import {withHistory} from "slate-history";
import ComboBox from "../../../theme/widgets/comboBox/comboBox";
import {
    ElementProps,
    ISlateElementPlugin,
    ISlateLeafPlugin,
    LeafProps,
} from "./slate/slateModel";
import {FontFamilyInput, fontFamilyPlugin} from "./slate/fontFamilyPlugin";
import {FontHighlightInput, fontHighlightPlugin} from "./slate/fontHighlightPlugin";
import {FontColorInput, fontColorPlugin} from "./slate/fontColorPlugin";
import {BoldInput, boldPlugin} from "./slate/boldPlugin";
import {ItalicInput, italicPlugin} from "./slate/italicPlugin";
import {UnderlineInput, underlinePlugin} from "./slate/underlinePlugin";
import {FontSizeInput, fontSizePlugin} from "./slate/fontSizePlugin";
import {TextAlignInputToolbar, textAlignPlugin} from "./slate/textAlignPlugin";
import {ListInputToolbar, listPlugin} from "./slate/listPlugin";
import {forEach} from "../../../../framework.core/extras/utils/collectionUtils";
import {RichTextEditViewProps} from "../reportPanelModel";
import {SuperscriptInput, superscriptPlugin} from "./slate/superscriptPlugin";
import Button from "../../../theme/widgets/button/button";
import {insertFootnote, removeFootnote, withFootnotes} from "./slate/footnote-utils";
import {SubscriptInput, subscriptPlugin} from "./slate/subscriptPlugin";

const citation = [
    {
        id: 'mla',
        title: 'MLA',
    },
    {
        id: 'chicago',
        title: 'Chicago'
    },
    {
        id: 'harvard',
        title: 'Harvard'
    },
    {
        id: 'apa',
        title: 'APA'
    }
]

const slateLeafPlugins: ISlateLeafPlugin[] = [
    boldPlugin,
    fontColorPlugin,
    fontFamilyPlugin,
    fontHighlightPlugin,
    fontSizePlugin,
    italicPlugin,
    underlinePlugin,
    superscriptPlugin,
    subscriptPlugin,
]

const slateElementPlugins: ISlateElementPlugin[] = [
    listPlugin,
    textAlignPlugin
]

export function RichTextEditView(props: RichTextEditViewProps) {
    const { value, onReportValueChanged } = props;

    const editorRef = useRef<Editor>()
    if (!editorRef.current) {
        editorRef.current =
            withFootnotes(
                withHistory(
                    withReact(
                        createEditor())))
    }
    const editor = editorRef.current
    const renderElement = useCallback(props => <Element {...props} />, [])
    const renderLeaf = useCallback(props => <Leaf {...props} />, []);

    if (editor && value) {
        if (editor.children) {
            editor.children = value;
        }
    }

    return (
        <Slate
            editor={editor}
            value={value}//initial value
            onChange={(value: any) => onReportValueChanged(value, editor)}>
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
                            {/*<SuperscriptInput />*/}
                            {/*<SubscriptInput />*/}
                        </div>
                        {/*<Button text={"Footnote"} onClick={() => insertFootnote(editor)}/>*/}
                        {/*<div className={'d-flex'}>*/}
                        {/*    <ComboBox items={citation} title={'MLA'}/>*/}
                        {/*</div>*/}
                    </div>
                </div>

                <div className={'flex-fill d-flex position-relative h-100'}>
                    <div className={'position-absolute bg-primary w-100 h-100 overflow-auto pr-4 pt-4'}>
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

                                        if (event.key.toUpperCase() === 'BACKSPACE') {
                                            event.preventDefault();

                                            if (editor && editor.selection) {
                                                const node: any = Editor.node(editor, editor.selection?.anchor, {edge: "start"});

                                                if (node) {
                                                    const footnote_type = node[0].footnote || "";

                                                    if (footnote_type === "excerpt_number") {
                                                        const text = node[0].text;

                                                        if (text && text !== "") {
                                                            const id = node[0].id || "";

                                                            removeFootnote(editor, id);
                                                        } else {
                                                            Transforms.delete(editor, {unit: "character", reverse: true});
                                                        }
                                                    } else {
                                                        Transforms.delete(editor, {unit: "character", reverse: true});
                                                    }
                                                }
                                            }
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

    const { attributes, element } = props;

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
