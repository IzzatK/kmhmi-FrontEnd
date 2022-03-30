import {Editor, Element as SlateElement} from "slate";
import React from "react";

export const isKeyMod = (event: React.KeyboardEvent) => (event.metaKey && !event.ctrlKey) || event.ctrlKey;

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