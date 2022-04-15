import React, {useCallback, useRef} from "react";
import {Editable, ReactEditor, Slate, withReact,} from "slate-react";
import {BaseEditor, createEditor, Editor, Transforms, Node} from "slate";
import {HistoryEditor, withHistory} from "slate-history";
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
import {superscriptPlugin} from "./slate/superscriptPlugin";
import {makeGuid} from "../../../../framework.core/extras/utils/uniqueIdUtils";

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
    underlinePlugin,
    superscriptPlugin
]

const slateElementPlugins: ISlateElementPlugin[] = [
    listPlugin,
    textAlignPlugin
]

const withHtml = (editor: BaseEditor & ReactEditor & HistoryEditor) => {
    const { insertData, isInline, isVoid } = editor

    editor.isInline = (element) => {
        // @ts-ignore
        return element.type === 'link' ? true : isInline(element)
    }

    editor.isVoid = (element) => {
        // @ts-ignore
        return element.type === 'image' ? true : isVoid(element)
    }

    editor.insertData = (data: DataTransfer) => {

        const excerpt = data.getData('text/excerpt');
        const excerpt_id = data.getData("text/excerpt/excerpt_id");

        if (excerpt) {
            let footnote_number = 1;
            let footnote_count = 0;
            let excerpt_count = 0;
            let footnote_location = 0;
            let id = makeGuid();
            if (editor.selection) {
                let index = 0;

                forEach(editor.children, (child: any) => {
                    if (child.children) {
                        if (child.children[0]) {
                            if (child.children[0].type) {
                                if (child.children[0].type === "excerpt") {
                                    excerpt_count++;

                                    if (editor.selection) {
                                        if (index < editor.selection.focus.path[0]) {
                                            footnote_number++;
                                        }
                                    }

                                    if (excerpt_count >= footnote_number) {

                                        let childIndex = 0;
                                        forEach(child.children, (innerChild: any) => {
                                            if (innerChild.type) {
                                                if (innerChild.type === "footnote_number") {
                                                    let id = "";
                                                    if (innerChild.id) {
                                                        id = innerChild.id;
                                                    }

                                                    Transforms.delete(editor, {at: {path: [index, childIndex], offset: 0}});

                                                    const footnoteNumberNode: Node = {
                                                        // @ts-ignore
                                                        type: 'footnote_number',
                                                        text: (excerpt_count + 1).toString(),
                                                        superscript: true,
                                                        id,
                                                    }

                                                    Transforms.insertNodes(editor, footnoteNumberNode, {at: [index, childIndex]})
                                                }
                                            }
                                            childIndex++;
                                        })
                                    }
                                } else if (child.children[0].type === "footnote_number_footnote") {
                                    footnote_count++;

                                    if (footnote_count === footnote_number) {
                                        footnote_location += index;
                                    }

                                    if (footnote_count >= footnote_number) {

                                        Transforms.delete(editor, {at: {path: [index, 0], offset: 0}});
                                        Transforms.insertText(editor, (footnote_count + 1).toString(), {at: {path: [index, 0], offset: 0}})
                                    }
                                }
                            }
                        }
                    }
                    index++;
                })
            }

            const footnoteNode: Node = {
                children: [
                    {
                        // @ts-ignore
                        type: 'footnote_number_footnote',
                        text: footnote_number + ". ",
                        id,
                    },
                    {
                        // @ts-ignore
                        type: 'footnote',
                        id,
                        text: excerpt,
                        excerpt_id,
                    }
                ]
            }

            if (footnote_location === 0) {
                Transforms.insertNodes(
                    editor,
                    footnoteNode,
                    { at: [editor.children.length] }
                )
            } else {
                Transforms.insertNodes(
                    editor,
                    footnoteNode,
                { at: [footnote_location] }
                )
            }



            const text = data.getData('text/plain');


            const excerptNode: Node = {
                children: [
                    {
                        // @ts-ignore
                        type: 'excerpt',
                        excerpt_id,
                        text,
                        id
                    },
                    {
                        // @ts-ignore
                        type: 'footnote_number',
                        text: footnote_number.toString(),
                        superscript: true,
                        id,
                    }
                ]
            }

            Transforms.insertNodes(
                editor,
                excerptNode,
            )
        } else {
            insertData(data)
        }
    }

    return editor
}

export function RichTextEditView(props: RichTextEditViewProps) {
    const { value, onReportValueChanged } = props;

    const editorRef = useRef<Editor>()
    if (!editorRef.current) {
        editorRef.current =
            withHtml(
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
            onChange={onReportValueChanged}>
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
                                                const node: any = Editor.node(editor, editor.selection?.anchor);

                                                if (node) {
                                                    forEach(node, (child: any) => {
                                                        if (child.type) {
                                                            if (child.type === "footnote_number") {

                                                                if (child.id) {
                                                                    let id = child.id;

                                                                    let index = 0;

                                                                    forEach(editor.children, (child: any) => {
                                                                        if (child.children) {
                                                                            let subIndex = 0;
                                                                            forEach(child.children, (innerChild: any) => {
                                                                                if (innerChild.type) {
                                                                                    if (innerChild.type === "footnote") {
                                                                                        if (innerChild.id) {
                                                                                            if (innerChild.id === id) {
                                                                                                Transforms.delete(editor, {at: [index, subIndex]});
                                                                                                Transforms.delete(editor, {at: [index, subIndex - 1]});
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                                                                subIndex++;
                                                                            })
                                                                        }
                                                                        index++;
                                                                    })

                                                                }

                                                            }
                                                        }
                                                    })
                                                }
                                            }

                                            Transforms.delete(editor, {unit: "character", reverse: true});
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

        switch (element.type) {
            case "excerpt":
                children = (
                    <p {...attributes}>
                        {children}
                    </p>
                )
                break;
            case "footnote":
                children = (
                    <p {...attributes}>
                        {children}
                    </p>
                )
                break;
            default:
                children = (
                    <p {...attributes}>
                        {children}
                    </p>
                )
                break;

        }
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
