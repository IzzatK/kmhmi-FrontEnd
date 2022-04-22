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

                forEach(editor.children, (editor_child: any) => {
                    if (editor_child.children) {
                        let editor_child_child_index = 0;
                        forEach(editor_child.children, (child: any) => {
                            let footnote_type = child.footnote || "";

                            if (footnote_type === "excerpt") {
                                const sibling_index = editor_child_child_index + 1;
                                const sibling = editor_child.children[sibling_index];

                                if (sibling) {
                                    let sibling_footnote_type = sibling.footnote || "";

                                    if (sibling_footnote_type === "excerpt_number") {
                                        excerpt_count++;

                                        if (editor.selection) {
                                            if (editor_child_index < editor.selection.focus.path[0]) {
                                                footnote_number++;
                                            }
                                        }

                                        if (excerpt_count >= footnote_number) {
                                            const sibling_id = sibling.id || "";

                                            Transforms.removeNodes(editor, {at: [editor_child_index, sibling_index]}); //TODO add match

                                            const excerptNumberNode: Node = {
                                                // @ts-ignore
                                                footnote: 'excerpt_number',
                                                text: (excerpt_count + 1).toString(),
                                                superscript: true,
                                                id: sibling_id,
                                            }

                                            Transforms.insertNodes(editor, excerptNumberNode, {at: [editor_child_index, sibling_index]})
                                        }
                                    } else {
                                        // @ts-ignore
                                        Transforms.setNodes(editor, { footnote: "" }, {at: [editor_child_index, editor_child_child_index]})//TODO need different solution
                                    }
                                } else {
                                    // @ts-ignore
                                    Transforms.setNodes(editor, { footnote: "" }, {at: [editor_child_index, editor_child_child_index]})//TODO need different solution
                                }
                            } else if (footnote_type === "footnote_number") {
                                if (child.text !== "") {
                                    footnote_count++;

                                    if (footnote_count === footnote_number) {
                                        footnote_location += editor_child_index;
                                    }

                                    if (footnote_count >= footnote_number) {
                                        const child_id = child.id || "";

                                        Transforms.removeNodes(editor, {at: [editor_child_index, editor_child_child_index]});

                                        const footnoteNumberNode: Node = {
                                            // @ts-ignore
                                            footnote: 'footnote_number',
                                            text: (footnote_count + 1) + ". ",
                                            id: child_id,
                                        }

                                        Transforms.insertNodes(editor, footnoteNumberNode, {at: [editor_child_index, editor_child_child_index]})
                                    }
                                } else {
                                    // @ts-ignore
                                    Transforms.setNodes(editor, { footnote: "" }, {at: [editor_child_index, editor_child_child_index]})//TODO need different solution
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
                        footnote: 'footnote_number',
                        text: footnote_number + ". ",
                        id,
                    },
                    {
                        // @ts-ignore
                        footnote: 'footnote',
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
                        footnote: 'excerpt',
                        excerpt_id,
                        text,
                        id
                    },
                    {
                        // @ts-ignore
                        footnote: 'excerpt_number',
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

        forEach(editor.children, (editor_child: any) => {
            if (editor_child.children) {
                let editor_child_child_index = 0;
                forEach(editor_child.children, (child: any) => {
                    let footnote_type = child.footnote || "";

                    if (footnote_type === "excerpt") {
                        const sibling_index = editor_child_child_index + 1;
                        const sibling = editor_child.children[sibling_index];

                        if (sibling) {
                            let sibling_footnote_type = sibling.footnote || "";

                            if (sibling_footnote_type === "excerpt_number") {
                                excerpt_count++;

                                if (editor.selection) {
                                    if (editor_child_index < editor.selection.focus.path[0]) {
                                        footnote_number++;
                                    }
                                }

                                if (excerpt_count >= footnote_number) {
                                    const sibling_id = sibling.id || "";

                                    Transforms.removeNodes(editor, {at: [editor_child_index, sibling_index]}); //TODO add match

                                    const excerptNumberNode: Node = {
                                        // @ts-ignore
                                        footnote: 'excerpt_number',
                                        text: (excerpt_count + 1).toString(),
                                        superscript: true,
                                        id: sibling_id,
                                    }

                                    Transforms.insertNodes(editor, excerptNumberNode, {at: [editor_child_index, sibling_index]})
                                }
                            } else {
                                // @ts-ignore
                                Transforms.setNodes(editor, { footnote: "" }, {at: [editor_child_index, editor_child_child_index]})//TODO need different solution
                            }

                        } else {
                            // @ts-ignore
                            Transforms.setNodes(editor, { footnote: "" }, {at: [editor_child_index, editor_child_child_index]})//TODO need different solution
                        }
                    } else if (footnote_type === "footnote_number") {
                        if (child.text !== "") {
                            footnote_count++;

                            if (footnote_count === footnote_number) {
                                footnote_location += editor_child_index;
                            }

                            if (footnote_count >= footnote_number) {
                                const child_id = child.id || "";

                                Transforms.removeNodes(editor, {at: [editor_child_index, editor_child_child_index]});

                                const footnoteNumberNode: Node = {
                                    // @ts-ignore
                                    footnote: 'footnote_number',
                                    text: (footnote_count + 1) + ". ",
                                    id: child_id,
                                }

                                Transforms.insertNodes(editor, footnoteNumberNode, {at: [editor_child_index, editor_child_child_index]})
                            }
                        } else {
                            // @ts-ignore
                            Transforms.setNodes(editor, { footnote: "" }, {at: [editor_child_index, editor_child_child_index]})//TODO need different solution
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
                footnote: 'footnote_number',
                text: footnote_number + ". ",
                id,
            },
            {
                // @ts-ignore
                footnote: 'footnote',
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
                            footnote: 'excerpt',//TODO check for other styling
                            text,
                            id
                        },
                        {
                            // @ts-ignore
                            footnote: 'excerpt_number',
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
                            footnote: 'excerpt',//TODO check for other styling
                            text,
                            id
                        },
                        {
                            // @ts-ignore
                            footnote: 'excerpt_number',
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

export function removeFootnote(editor: Editor, id: string) {
    let footnote_number = 1;
    let footnote_count = 0;
    let excerpt_count = 0;

    if (id) {
        let editor_child_index = 0;

        forEach(editor.children, (editor_child: any) => {
            if (editor_child.children) {
                let editor_child_child_index = 0;

                forEach(editor_child.children, (child: any) => {
                    const child_footnote_type = child.footnote || "";
                    const child_id = child.id || "";

                    if (child_footnote_type === "excerpt") {
                        const sibling_index = editor_child_child_index + 1;
                        const sibling = editor_child.children[sibling_index];

                        if (child_id === id) {
                            // @ts-ignore
                            Transforms.setNodes(editor, { footnote: "" }, {at: [editor_child_index, editor_child_child_index]})//TODO need different solution

                            if (sibling) {
                                const sibling_footnote_type = sibling.footnote || "";

                                if (sibling_footnote_type === "excerpt_number") {
                                    Transforms.removeNodes(editor, {at: [editor_child_index, sibling_index]}); //TODO add match
                                }
                            }
                        } else if (sibling) {
                            const sibling_footnote_type = sibling.footnote || "";

                            if (sibling_footnote_type === "excerpt_number") {
                                excerpt_count++;

                                if (editor.selection) {
                                    if (editor_child_index < editor.selection.focus.path[0]) {
                                        footnote_number++;
                                    }
                                }

                                if (excerpt_count >= footnote_number) {
                                    const sibling_id = sibling.id || "";

                                    Transforms.removeNodes(editor, {at: [editor_child_index, sibling_index]}); //TODO add match

                                    const excerptNumberNode: Node = {
                                        // @ts-ignore
                                        footnote: 'excerpt_number',
                                        text: (excerpt_count).toString(),
                                        superscript: true,
                                        id: sibling_id,
                                    }

                                    Transforms.insertNodes(editor, excerptNumberNode, {at: [editor_child_index, sibling_index]})
                                }
                            }
                        } else {
                            // @ts-ignore
                            Transforms.setNodes(editor, { footnote: "" }, {at: [editor_child_index, editor_child_child_index]})//TODO need different solution
                        }
                    } else if (child_footnote_type === "footnote_number") {

                        if (child_id === id) {
                            const sibling_index = editor_child_child_index + 1;
                            const sibling = editor_child.children[sibling_index];

                            if (sibling) {
                                const sibling_footnote_type = sibling.footnote || "";

                                if (sibling_footnote_type === "footnote") {
                                    Transforms.delete(editor, {at: [editor_child_index, sibling_index]});
                                }
                            }

                            Transforms.delete(editor, {at: [editor_child_index, editor_child_child_index]});

                        } else {
                            if (child.text !== "") {
                                footnote_count++;

                                if (footnote_count >= footnote_number) {
                                    const child_id = child.id || "";

                                    Transforms.removeNodes(editor, {at: [editor_child_index, editor_child_child_index]});

                                    const footnoteNumberNode: Node = {
                                        // @ts-ignore
                                        footnote: 'footnote_number',
                                        text: (footnote_count) + ". ",
                                        id: child_id,
                                    }

                                    Transforms.insertNodes(editor, footnoteNumberNode, {at: [editor_child_index, editor_child_child_index]})
                                }
                            } else {
                                // @ts-ignore
                                Transforms.setNodes(editor, { footnote: "" }, {at: [editor_child_index, editor_child_child_index]})//TODO need different solution
                            }
                        }
                    }

                    editor_child_child_index++;
                })
            }

            editor_child_index++;
        })

    }
}
