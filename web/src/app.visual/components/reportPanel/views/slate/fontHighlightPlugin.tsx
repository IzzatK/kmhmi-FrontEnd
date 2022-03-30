import {HighlightColorInputProps, ISlateLeafPlugin, LeafProps, LeafType} from "./slateModel";
import React, {useState} from "react";
import {useSlate} from "slate-react";
import {Editor} from "slate";
import Portal from "../../../../theme/widgets/portal/portal";
import Button from "../../../../theme/widgets/button/button";
import {TextFormatHighlightSVG} from "../../../../theme/svgs/textFormatHighlightSVG";
import {getMarkValue, hasMark, setMark} from "./slate-utils";


const markKey = 'fontHighlight';
const defaultMarkValue = 'transparent';

function renderFontHighlightLeaf(leaf: LeafType, children: any) {
    let result = children;

    if (leaf.fontHighlight) {
        const style = {
            backgroundColor: leaf.fontHighlight || ''
        }

        result = <span style={style}>{result}</span>
    }

    return result;
}

export function FontHighlightInput(props: HighlightColorInputProps) {
    const [isOpen, setIsOpen] = useState(false);
    const editor = useSlate();

    function _onSelect(id: string) {
        const nextColor: string = id === getFontHighlightMark(editor) ? defaultMarkValue: id;

        fontHighlightStrategy(editor, nextColor)

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
                        <div className={`shadow d-flex h-gap-3 p-3 bg-muted mt-2`}>
                            <div className={'p-4'} style={{backgroundColor: 'yellow'}} onClick={() => _onSelect('yellow')}/>
                            <div className={'p-4'} style={{backgroundColor: 'green'}} onClick={() => _onSelect('green')}/>
                            <div className={'p-4'} style={{backgroundColor: 'blue'}} onClick={() => _onSelect('blue')}/>
                            <div className={'p-4'} style={{backgroundColor: 'pink'}} onClick={() => _onSelect('pink')}/>
                        </div>
                    )
                }}>
                <div tabIndex={0}>
                    <Button className={'btn-transparent rounded-0'} style={{borderBottom: `0.1rem solid ${getFontHighlightMark(editor)}`}} onClick={() => _onClickHandler()}>
                        <TextFormatHighlightSVG className={'small-image-container'}/>
                    </Button>
                </div>
            </Portal>
        </div>
    )
}

function fontHighlightStrategy(editor: Editor, value: string) {
    setMark(editor, markKey, value);
}

function hasFontHighlightMark (editor: Editor) {
    return hasMark(editor, markKey);
}

function getFontHighlightMark (editor: Editor) {
    return getMarkValue(editor, markKey, defaultMarkValue);
}

export const fontHighlightPlugin: ISlateLeafPlugin = {
    render: renderFontHighlightLeaf,
}

