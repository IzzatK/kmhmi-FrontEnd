import {HighlightColorInputProps, LeafProps, LeafType} from "./slateModel";
import React, {useState} from "react";
import {ReactEditor, useSlate} from "slate-react";
import {Editor} from "slate";
import Portal from "../../../../theme/widgets/portal/portal";
import Button from "../../../../theme/widgets/button/button";
import {TextFormatHighlightSVG} from "../../../../theme/svgs/textFormatHighlightSVG";
import {TextFormatColorSVG} from "../../../../theme/svgs/textFormatColorSVG";
import {getMarkValue} from "./slate-utils";


const markKey = 'fontColor';
const defaultMarkValue = 'black';

export function renderFontColorLeaf(leaf: LeafType, children: any) {
    let result = children;

    if (leaf.fontColor) {
        const style = {
            color: leaf.fontColor || defaultMarkValue
        }

        result = <span style={style}>{result}</span>
    }

    return result;
}

export function FontColorInput(props: HighlightColorInputProps) {
    const [isOpen, setIsOpen] = useState(false);
    // const [color, setColor] = useState('black');
    const editor = useSlate();

    function _onSelect(id: string) {
        const nextColor: string = id === getFontColorMark(editor) ? defaultMarkValue: id;

        fontColorStrategy(editor, nextColor);

        setIsOpen(false);
    }

    function _onClickHandler() {
        if (isOpen) {
            setIsOpen(false);
        }
        else {
            setIsOpen(true);
        }
    }

    return (
        <div>
            <Portal
                isOpen={isOpen}
                zIndex={9999}
                enterClass={'growVertical'}
                exitClass={'shrinkVertical'}
                timeout={200}
                autoLayout={false}
                onShouldClose={_onClickHandler}
                portalContent={(relatedWidth: any) => {
                    return (
                        <div className={`shadow p-3 bg-muted mt-2 d-grid`} style={{gridTemplateColumns: 'repeat(4, 1fr)', gridAutoRows: '1fr'}}>
                            <div className={'p-4'} style={{backgroundColor: 'yellow'}} onClick={() => _onSelect('yellow')}/>
                            <div className={'p-4'} style={{backgroundColor: 'red'}} onClick={() => _onSelect('red')}/>
                            <div className={'p-4'} style={{backgroundColor: 'darkgray'}} onClick={() => _onSelect('darkgray')}/>
                            <div className={'p-4'} style={{backgroundColor: 'gray'}} onClick={() => _onSelect('gray')}/>
                            <div className={'p-4'} style={{backgroundColor: 'orange'}} onClick={() => _onSelect('orange')}/>
                            <div className={'p-4'} style={{backgroundColor: 'lightblue'}} onClick={() => _onSelect('lightblue')}/>
                            <div className={'p-4'} style={{backgroundColor: 'black'}} onClick={() => _onSelect('black')}/>
                            <div className={'p-4'} style={{backgroundColor: 'darkmagenta'}} onClick={() => _onSelect('darkmagenta')}/>
                        </div>
                    )
                }}>
                <div tabIndex={0}>
                    <Button className={'btn-transparent rounded-0'} style={{borderBottom: `0.1rem solid ${getFontColorMark(editor)}`}} onClick={() => _onClickHandler()}>
                        <TextFormatColorSVG className={'small-image-container'}/>
                    </Button>
                </div>
            </Portal>
        </div>
    )
}

function fontColorStrategy(editor: Editor, value: string) {
    editor.removeMark(markKey)

    editor.addMark(markKey, value);

    ReactEditor.focus(editor);
}

function hasFontColorMark (editor: Editor) {
    const marks = Editor.marks(editor) as Record<string, boolean>
    return marks ? marks[markKey] : false
}

function getFontColorMark (editor: Editor) {
    return getMarkValue(editor, markKey, defaultMarkValue);
}


