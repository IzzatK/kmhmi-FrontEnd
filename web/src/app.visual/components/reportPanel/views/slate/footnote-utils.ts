import {BaseEditor, Editor, Node, Transforms} from "slate";
import {makeGuid} from "../../../../../framework.core/extras/utils/uniqueIdUtils";
import {forEach} from "../../../../../framework.core/extras/utils/collectionUtils";
import {ReactEditor} from "slate-react";
import {HistoryEditor} from "slate-history";

export const withFootnotes = (editor: BaseEditor & ReactEditor & HistoryEditor) => {
    const { insertData } = editor

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
                let editor_child_index = 0;

                forEach(editor.children, (editorChild: any) => {
                    if (editorChild.children) {
                        let editor_child_child_index = 0;
                        forEach(editorChild.children, (child: any) => {
                            let footNote_type = child.footNote || "";

                            if (footNote_type === "excerpt") {
                                const sibling_index = editor_child_child_index + 1;
                                const sibling = editorChild.children[sibling_index];

                                if (sibling) {
                                    let sibling_footNote_type = sibling.footNote || "";

                                    if (sibling_footNote_type === "excerpt_number") {
                                        excerpt_count++;

                                        if (editor.selection) {
                                            if (editor_child_index < editor.selection.focus.path[0]) {
                                                footnote_number++;
                                            }
                                        }

                                        if (excerpt_count >= footnote_number) {
                                            let id = "";
                                            if (sibling.id) {
                                                id = sibling.id;
                                            }

                                            Transforms.removeNodes(editor, {at: [editor_child_index, sibling_index]}); //TODO add match

                                            const excerptNumberNode: Node = {
                                                // @ts-ignore
                                                footNote: 'excerpt_number',
                                                text: (excerpt_count + 1).toString(),
                                                superscript: true,
                                                id,
                                            }

                                            Transforms.insertNodes(editor, excerptNumberNode, {at: [editor_child_index, sibling_index]})
                                        }
                                    } else {
                                        // @ts-ignore
                                        Transforms.setNodes(editor, { footNote: "" }, {at: [editor_child_index, editor_child_child_index]})//TODO need different solution
                                    }
                                } else {
                                    // @ts-ignore
                                    Transforms.setNodes(editor, { footNote: "" }, {at: [editor_child_index, editor_child_child_index]})//TODO need different solution
                                }
                            } else if (footNote_type === "footnote_number") {
                                if (child.text !== "") {
                                    footnote_count++;

                                    if (footnote_count === footnote_number) {
                                        footnote_location += editor_child_index;
                                    }

                                    if (footnote_count >= footnote_number) {

                                        Transforms.removeNodes(editor, {at: [editor_child_index, editor_child_child_index]});

                                        const footnoteNumberNode: Node = {
                                            // @ts-ignore
                                            footNote: 'footnote_number',
                                            text: (footnote_count + 1) + ". ",
                                            id,
                                        }

                                        Transforms.insertNodes(editor, footnoteNumberNode, {at: [editor_child_index, editor_child_child_index]})
                                    }
                                } else {
                                    // @ts-ignore
                                    Transforms.setNodes(editor, { footNote: "" }, {at: [editor_child_index, editor_child_child_index]})//TODO need different solution
                                }
                            }

                            editor_child_child_index++;
                        })
                    }
                    editor_child_index++;
                })
            }

            const footnoteNode: Node = {
                children: [
                    {
                        // @ts-ignore
                        footNote: 'footnote_number',
                        text: footnote_number + ". ",
                        id,
                    },
                    {
                        // @ts-ignore
                        footNote: 'footnote',
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
                        footNote: 'excerpt',
                        excerpt_id,
                        text,
                        id
                    },
                    {
                        // @ts-ignore
                        footNote: 'excerpt_number',
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

export function insertFootnote(editor: Editor) {
    let footnote_number = 1;
    let footnote_count = 0;
    let excerpt_count = 0;
    let footnote_location = 0;
    let id = makeGuid();
    if (editor.selection) {
        let editor_child_index = 0;

        forEach(editor.children, (editorChild: any) => {
            if (editorChild.children) {
                let editor_child_child_index = 0;
                forEach(editorChild.children, (child: any) => {
                    let footNote_type = child.footNote || "";

                    if (footNote_type === "excerpt") {
                        const sibling_index = editor_child_child_index + 1;
                        const sibling = editorChild.children[sibling_index];

                        if (sibling) {
                            let sibling_footNote_type = sibling.footNote || "";

                            if (sibling_footNote_type === "excerpt_number") {
                                excerpt_count++;

                                if (editor.selection) {
                                    if (editor_child_index < editor.selection.focus.path[0]) {
                                        footnote_number++;
                                    }
                                }

                                if (excerpt_count >= footnote_number) {
                                    let id = "";
                                    if (sibling.id) {
                                        id = sibling.id;
                                    }

                                    Transforms.removeNodes(editor, {at: [editor_child_index, sibling_index]}); //TODO add match

                                    const excerptNumberNode: Node = {
                                        // @ts-ignore
                                        footNote: 'excerpt_number',
                                        text: (excerpt_count + 1).toString(),
                                        superscript: true,
                                        id,
                                    }

                                    Transforms.insertNodes(editor, excerptNumberNode, {at: [editor_child_index, sibling_index]})
                                }
                            } else {
                                // @ts-ignore
                                Transforms.setNodes(editor, { footNote: "" }, {at: [editor_child_index, editor_child_child_index]})//TODO need different solution
                            }

                        } else {
                            // @ts-ignore
                            Transforms.setNodes(editor, { footNote: "" }, {at: [editor_child_index, editor_child_child_index]})//TODO need different solution
                        }
                    } else if (footNote_type === "footnote_number") {
                        if (child.text !== "") {
                            footnote_count++;

                            if (footnote_count === footnote_number) {
                                footnote_location += editor_child_index;
                            }

                            if (footnote_count >= footnote_number) {

                                Transforms.removeNodes(editor, {at: [editor_child_index, editor_child_child_index]});

                                const footnoteNumberNode: Node = {
                                    // @ts-ignore
                                    footNote: 'footnote_number',
                                    text: (footnote_count + 1) + ". ",
                                    id,
                                }

                                Transforms.insertNodes(editor, footnoteNumberNode, {at: [editor_child_index, editor_child_child_index]})
                            }
                        } else {
                            // @ts-ignore
                            Transforms.setNodes(editor, { footNote: "" }, {at: [editor_child_index, editor_child_child_index]})//TODO need different solution
                        }
                    }

                    editor_child_child_index++;
                })
            }
            editor_child_index++;
        })
    }

    const footnoteNode: Node = {
        children: [
            {
                // @ts-ignore
                footNote: 'footnote_number',
                text: footnote_number + ". ",
                id,
            },
            {
                // @ts-ignore
                footNote: 'footnote',
                id,
                text: "Enter Footnote Here",
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

    if (editor.selection) {
        if (editor.selection.focus) {
            let index_0 = editor.selection.focus.path[0];
            let index_1 = editor.selection.focus.path[1];

            let child: any;
            let text: string;

            if (index_1 > 0) {
                Transforms.splitNodes(editor, {at: [index_0, index_1]});
                child = editor.children[index_1];
                text = child.children[0].text;
                Transforms.delete(editor, {at: [index_1, 0]});

                const excerptNode: Node = {
                    children: [
                        {
                            // @ts-ignore
                            footNote: 'excerpt',//TODO check for other styling
                            text,
                            id
                        },
                        {
                            // @ts-ignore
                            footNote: 'excerpt_number',
                            text: footnote_number.toString(),
                            superscript: true,
                            id,
                        }
                    ]
                }

                Transforms.insertNodes(editor, excerptNode, { at: [index_1, 0]})
            } else {
                child = editor.children[index_0];
                text = child.children[index_1].text;
                Transforms.delete(editor, {at: [index_0, index_1]});

                const excerptNode: Node = {
                    children: [
                        {
                            // @ts-ignore
                            footNote: 'excerpt',//TODO check for other styling
                            text,
                            id
                        },
                        {
                            // @ts-ignore
                            footNote: 'excerpt_number',
                            text: footnote_number.toString(),
                            superscript: true,
                            id,
                        }
                    ]
                }

                Transforms.insertNodes(editor, excerptNode, { at: [index_0, index_1]})
            }
        }
    }
}

export function removeFootnote(editor: Editor) {
    if (!editor || !editor.selection) return;

    const node: any = Editor.node(editor, editor.selection?.anchor);

    if (node) {
        forEach(node, (child: any) => {
            if (child.footNote) {
                if (child.footNote === "excerpt_number") {
                    // Transforms.delete(editor, {at: editor.selection?.anchor.path});
                    if (child.id) {
                        let id = child.id;

                        let footnote_index = 0;

                        forEach(editor.children, (child: any) => {
                            if (child.children) {
                                let footnote_number_index = 0;
                                forEach(child.children, (innerChild: any) => {
                                    if (innerChild.footNote) {
                                        if (innerChild.footNote === "footnote") {
                                            if (innerChild.id) {
                                                if (innerChild.id === id) {
                                                    Transforms.delete(editor, {at: [footnote_index, footnote_number_index]});
                                                    Transforms.delete(editor, {at: [footnote_index, footnote_number_index - 1]});

                                                    let footnote_number = 1;
                                                    let footnote_count = 0;
                                                    let excerpt_count = 0;
                                                    let editor_child_index = 0;

                                                    forEach(editor.children, (editorChild: any) => {
                                                        if (editorChild.children) {
                                                            let editor_child_child_index = 0;
                                                            forEach(editorChild.children, (child: any) => {
                                                                let footNote_type = child.footNote || "";

                                                                if (footNote_type === "excerpt") {
                                                                    const sibling_index = editor_child_child_index + 1;
                                                                    const sibling = editorChild.children[sibling_index];

                                                                    if (sibling) {
                                                                        let sibling_footNote_type = sibling.footNote || "";

                                                                        if (sibling_footNote_type === "excerpt_number") {
                                                                            excerpt_count++;

                                                                            if (editor.selection) {
                                                                                if (editor_child_index < editor.selection.focus.path[0]) {
                                                                                    footnote_number++;
                                                                                }
                                                                            }

                                                                            if (excerpt_count >= footnote_number) {
                                                                                let id = "";
                                                                                if (sibling.id) {
                                                                                    id = sibling.id;
                                                                                }

                                                                                Transforms.removeNodes(editor, {at: [editor_child_index, sibling_index]}); //TODO add match

                                                                                const excerptNumberNode: Node = {
                                                                                    // @ts-ignore
                                                                                    footNote: 'excerpt_number',
                                                                                    text: (excerpt_count + 1).toString(),
                                                                                    superscript: true,
                                                                                    id,
                                                                                }

                                                                                Transforms.insertNodes(editor, excerptNumberNode, {at: [editor_child_index, sibling_index]})
                                                                            }
                                                                        } else {
                                                                            // @ts-ignore
                                                                            Transforms.setNodes(editor, { footNote: "" }, {at: [editor_child_index, editor_child_child_index]})//TODO need different solution
                                                                        }
                                                                    } else {
                                                                        // @ts-ignore
                                                                        Transforms.setNodes(editor, { footNote: "" }, {at: [editor_child_index, editor_child_child_index]})//TODO need different solution
                                                                    }
                                                                } else if (footNote_type === "footnote_number") {
                                                                    if (child.text !== "") {
                                                                        footnote_count++;

                                                                        if (footnote_count >= footnote_number) {

                                                                            Transforms.removeNodes(editor, {at: [editor_child_index, editor_child_child_index]});

                                                                            const footnoteNumberNode: Node = {
                                                                                // @ts-ignore
                                                                                footNote: 'footnote_number',
                                                                                text: (footnote_count + 1) + ". ",
                                                                                id,
                                                                            }

                                                                            Transforms.insertNodes(editor, footnoteNumberNode, {at: [editor_child_index, editor_child_child_index]})
                                                                        }
                                                                    } else {
                                                                        // @ts-ignore
                                                                        Transforms.setNodes(editor, { footNote: "" }, {at: [editor_child_index, editor_child_child_index]})//TODO need different solution
                                                                    }
                                                                }

                                                                editor_child_child_index++;
                                                            })
                                                        }
                                                        editor_child_index++;
                                                    })
                                                }
                                            }
                                        }
                                    }
                                    footnote_number_index++;
                                })
                            }
                            footnote_index++;
                        })

                    }

                }
            }
        })
    }
}
