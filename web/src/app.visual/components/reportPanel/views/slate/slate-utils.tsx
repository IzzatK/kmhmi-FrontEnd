import {Editor, Element as SlateElement} from "slate";

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

                return !Editor.isEditor(n) &&
                    SlateElement.isElement(n) &&
                    lookup[elementKey] === elementValue;
            }

        })
    )

    return !!match
}