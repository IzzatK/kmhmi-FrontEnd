import {Editor, Element as SlateElement, Text} from "slate";
import React from "react";
import {ReactEditor} from "slate-react";

export const isKeyMod = (event: React.KeyboardEvent) => (event.metaKey && !event.ctrlKey) || event.ctrlKey;

export function hasMark(editor: Editor, markKey: string) {
    try {
        const marks = Editor.marks(editor) as Record<string, boolean>
        return marks ? marks[markKey] : false
    } catch (error) {
        console.log(error);
        return false;
    }

}

export function toggleMark(editor: Editor, markKey: string) {
    if (hasMark(editor, markKey)) {
        editor.removeMark(markKey);
    }
    else {
        editor.addMark(markKey, true);
    }

    ReactEditor.focus(editor);
}


export function setMark(editor: Editor, markKey: string, markValue: string) {
    editor.removeMark(markKey)

    editor.addMark(markKey, markValue);

    ReactEditor.focus(editor);
}

export function getMarkValue(editor: Editor, markKey: string, defaultValue: string) {
    let result: string = defaultValue;

    try {
        const marks = Editor.marks(editor) as Record<string, string>
        if (marks != null) {
            const currentValue = marks[markKey];
            if (currentValue != null) {
                result =  currentValue;
            }
        }
    } catch (error) {
        console.log(error);
    }


    return result;
}

export function isMultiElementActive(editor: Editor, elementKey: string, elementValue: any) {
    const { selection } = editor
    if (!selection) return false

    const [match] = Array.from(
        Editor.nodes(editor, {
            at: Editor.unhangRange(editor, selection),
            match: (n: any) => {
                const lookup: Record<string, string> = n;

                const result = !Editor.isEditor(n) &&
                    SlateElement.isElement(n) &&
                    lookup[elementKey] == elementValue;

                return result;
            }

        })
    )

    return !!match
}

const matchHtmlRegExp = /["'&<>]/

export function escapeHtml(string: string) {
    let str = '' + string
    let match = matchHtmlRegExp.exec(str)

    if (!match) {
        return str
    }

    let escape
    let html = ''
    let index = 0
    let lastIndex = 0

    for (index = match.index; index < str.length; index++) {
        switch (str.charCodeAt(index)) {
            case 34: // "
                escape = '&quot;'
                break
            case 38: // &
                escape = '&amp;'
                break
            case 39: // '
                escape = '&#39;'
                break
            case 60: // <
                escape = '&lt;'
                break
            case 62: // >
                escape = '&gt;'
                break
            default:
                continue
        }

        if (lastIndex !== index) {
            html += str.substring(lastIndex, index)
        }

        lastIndex = index + 1
        html += escape
    }

    return lastIndex !== index
        ? html + str.substring(lastIndex, index)
        : html
}

export const serialize = (node: any) => {
    if (Text.isText(node)) {
        let string = escapeHtml(node.text)
        // @ts-ignore
        if (node.bold) {
            string = `<strong>${string}</strong>`
        }
        // @ts-ignore
        if (node.fontColor) {
            // @ts-ignore
            string = `<span style={{color: ${node.fontColor}}}>${string}</span>`
        }
        // @ts-ignore
        if (node.fontFamily) {
            // @ts-ignore
            string = `<span style={{fontFamily: ${node.fontFamily}}}>${string}</span>`
        }
        // @ts-ignore
        if (node.fontHighlight) {
            // @ts-ignore
            string = `<span style={{backgroundColor: ${node.fontHighlight}}}>${string}</span>`
        }
        // @ts-ignore
        if (node.fontSize) {
            // @ts-ignore
            string = `<span style={{fontSize: ${parseInt(node.fontSize)}}}>${string}</span>`
        }
        // @ts-ignore
        if (node.italic) {
            string = `<i>${string}</i>`
        }
        // @ts-ignore
        if (node.superscript) {
            string = `<sup>${string}</sup>`
        }
        // @ts-ignore
        if (node.align) {
            // @ts-ignore
            string = `<div style={{textAlign: ${node.align}}}>${string}</div>`
        }
        // @ts-ignore
        if (node.underline) {
            string = `<u>${string}</u>`
        }
        return string
    }

    if (!node.childred) return "";

    const children = node.children.map((n: any) => serialize(n)).join('')

    // @ts-ignore
    if (node.align) {
        return `<div style={{textAlign: ${node.align}}}>${children}</div>`
    }

    switch (node.type) {
        case 'bulleted':
            return `<ul>${children}</ul>`
        case 'numbered':
            return `<ol>${children}</ol>`
        case 'list-item':
            return `<li>${children}</li>`
        case 'quote':
            return `<blockquote><p>${children}</p></blockquote>`
        case 'link':
            return `<a href="${escapeHtml(node.url)}">${children}</a>`
        case 'paragraph':
        default:
            return `<p>${children}</p>`
    }
}
