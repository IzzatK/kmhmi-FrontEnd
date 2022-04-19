import {Editor, Element as SlateElement} from "slate";
import React from "react";
import {ReactEditor} from "slate-react";

export const isKeyMod = (event: React.KeyboardEvent) => (event.metaKey && !event.ctrlKey) || event.ctrlKey;

export function hasMark(editor: Editor, markKey: string) {
    const marks = Editor.marks(editor) as Record<string, boolean>
    return marks ? marks[markKey] : false
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

    const marks = Editor.marks(editor) as Record<string, string>
    if (marks != null) {
        const currentValue = marks[markKey];
        if (currentValue != null) {
            result =  currentValue;
        }
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
