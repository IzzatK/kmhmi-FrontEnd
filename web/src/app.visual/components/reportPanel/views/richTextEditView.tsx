import {useMemo, useState} from "react";
import {Slate, Editable, withReact, ReactEditor} from "slate-react";
import {BaseEditor, createEditor, Descendant} from "slate";
import {HistoryEditor, withHistory} from "slate-history";

declare module 'slate' {
    interface CustomTypes {
        Editor: BaseEditor & ReactEditor & HistoryEditor
    }
}

const initialValue: Descendant[] = [
    {
        children: [
            { text: 'This is editable plain text, just like a <textarea>!' },
        ],
    },
]

export function RichTextEditView() {

    const editor = useMemo(() => withHistory(withReact(createEditor())), [])
    const [value, setValue] = useState<Descendant[]>(initialValue)

    return (
        <Slate
            editor={editor}
            value={value}
            onChange={setValue}>
            <div className={'rte-container flex-fill d-flex align-items-stretch bg-primary text-secondary'}>
                <Editable />
            </div>
        </Slate>
    )


}