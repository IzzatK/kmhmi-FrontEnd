import {
    RenderHighlightContentProps,
    RenderHighlightsProps,
    RenderHighlightTargetProps,
} from "@react-pdf-viewer/highlight";
import {DocumentPdfPreviewProps, ExcerptVM, NoteVM, PocketVM} from "./documentPanelModel";
import React, {Component} from "react";
import Button from "../../theme/widgets/button/button";
import {DeleteSVG} from "../../theme/svgs/deleteSVG";
import ComboBox from "../../theme/widgets/comboBox/comboBox";
import TextArea from "../../theme/widgets/textEdit/textArea";
import {forEach} from "../../../framework.core/extras/utils/collectionUtils";
import {bindInstanceMethods} from "../../../framework.core/extras/utils/typeUtils";
import TextEdit from "../../theme/widgets/textEdit/textEdit";
import {NoteSVG} from "../../theme/svgs/noteSVG";

export function renderHighlightTarget(pluginProps: RenderHighlightTargetProps, props: DocumentPdfPreviewProps) {
    return (
        <div className={"note position-absolute d-flex"}
             style={{
                 left: `${pluginProps.selectionRegion.left}%`,
                 top: `${pluginProps.selectionRegion.top + pluginProps.selectionRegion.height}%`,
             }}
        >
            <Button className={"rounded"} onClick={pluginProps.toggle}>
                <NoteSVG className={"small-image-container"}/>
            </Button>
        </div>
    );
}

export function renderHighlightContent(pluginProps: RenderHighlightContentProps, props: DocumentPdfPreviewProps) {

    let pocketId = props.tmpExcerpt["pocketId"] ? props.tmpExcerpt["pocketId"] : "";
    let pocketTitle = "";
    if (props.pockets && props.pockets[pocketId]) {
        pocketTitle = props.pockets[pocketId].title;
    } else {
        pocketTitle = "Select Pocket";
    }

    let noteText = props.tmpExcerpt["note_text"] ? props.tmpExcerpt["note_text"] : "";


    const addNote = () => {
        if (props.onCreateExcerpt) {

            let location = pluginProps.selectionData.startPageIndex + pluginProps.selectionData.startOffset;

            props.onCreateExcerpt(pluginProps.selectedText, pluginProps.highlightAreas, `${location}`);
        }
        pluginProps.cancel();
    };

    const updateTmpNote = (message: string) => {
        if (props.onUpdateTmpNote) {
            props.onUpdateTmpNote(message);
        }
    }

    const _onPocketSelectionChanged = (id: string) => {
        if (props.onPocketSelectionChanged) {
            props.onPocketSelectionChanged(id);
        }
    }

    const pockets: Record<string, PocketVM> = props.pockets;
    pockets[""] = {
        id: "",
        title: "+ Create New Pocket",
    }

    let top = pluginProps.selectionRegion.top + pluginProps.selectionRegion.height;



    if (props.zoomScale) {
        const limit = 100 - (200 / ((792 * props.zoomScale) + 15.994)) * 100;//TODO need to account for rem scaling

        if (top > limit) {
            top = 0;
        }
    }

    return (
        <div
            className={"popup d-flex flex-column bg-accent rounded position-absolute"}
            style={
            top === 0 ?
                {
                    bottom: 0,
                    marginTop: "auto",
                }
                :
                {
                    top: `${top}%`,
                }

        }>
            <div className={"d-flex flex-column v-gap-2 p-3 position-relative"}>
                <div className={"position-absolute close"}>
                    <Button className={"btn-transparent"} onClick={pluginProps.cancel}>
                        <DeleteSVG className={"nano-image-container"}/>
                    </Button>

                </div>
                <div className={"header-3"}>Excerpt</div>
                <ComboBox
                    items={pockets}
                    title={pocketTitle}
                    onSelect={ _onPocketSelectionChanged }
                />
                <TextArea
                    className={"p-0"}
                    name={"note"}
                    onChange={ updateTmpNote }
                    value={noteText}
                />
            </div>
            <div className={"d-flex justify-content-end bg-selected p-3 h-gap-3"}>
                <Button
                    light={true}
                    text={"Remove"}
                    onClick={pluginProps.cancel}
                />
                <Button
                    light={true}
                    text={"Save"}
                    onClick={addNote}
                />
            </div>
        </div>
    );
}

export type HighlightNotePair = {
    highlight: any[]
    note: NoteVM
}


export function renderHighlights(pluginProps: RenderHighlightsProps, props: DocumentPdfPreviewProps) {
    let highlights: HighlightNotePair[] = [];

    forEach(props.excerpts, (excerpt: ExcerptVM) => {
        let highlight = [];

        try {
            highlight = JSON.parse(excerpt.content);
        } catch (e) {
            console.log(e);
        }

        const highlightNotePair: HighlightNotePair = {
            highlight: highlight,
            note: excerpt.noteVM
        }

        highlights.push(highlightNotePair);
    });

    return (
        <div>
            {highlights?.map((highlightNotePair: HighlightNotePair) => {
                    const highlight = highlightNotePair.highlight;
                    const note = highlightNotePair.note;
                    return (
                        (
                            <React.Fragment key={note.id}>
                                {highlight
                                    // Filter all highlights on the current page
                                    .filter((area: any) => area.pageIndex === pluginProps.pageIndex)
                                    .map((area: any, idx: any) => (
                                        <div
                                            key={idx}
                                            style={Object.assign(
                                                {},
                                                {
                                                    position: 'relative',
                                                    background: 'rgba(255, 255, 0, 0.4)',
                                                    opacity: 1.0
                                                },
                                                pluginProps.getCssProperties(area, pluginProps.rotation)
                                            )}>
                                            {
                                                idx == 0 &&
                                                <NoteRenderer onSaveNote={props.onSaveNote} note={note}/>
                                            }
                                        </div>
                                    ))}
                            </React.Fragment>
                        )
                    )
                }
            )}
        </div>
    );
}

type NoteRendererProps = {
    note: NoteVM
    onSaveNote: (nodeVM: NoteVM) => void;
}

type NoteRendererState = {
    expanded: boolean;
    text: string;
}

class NoteRenderer extends Component<NoteRendererProps, NoteRendererState> {
    constructor(props: NoteRendererProps) {
        super(props);

        bindInstanceMethods(this);

        this.state = {
            expanded: false,
            text: this.props.note.text
        }
    }

    _onSaveNote() {
        this.setState({
            ...this.state,
            expanded: false
        })

        if (this.props.onSaveNote != null) {
            const noteVM: NoteVM = {
                id: this.props.note.id,
                text: this.state.text,
                content: this.state.text,
                excerpt_id: this.props.note.excerpt_id,
                resource_id: this.props.note.resource_id,
                pocket_id: this.props.note.pocket_id
            }

            this.props.onSaveNote(noteVM);
        }
    }

    _onCancelNote() {
        this.setState({
            text: this.props.note.text,
            expanded: false
        })
    }

    _onUpdateNote(value: string) {
        this.setState({
            ...this.state,
            text: value
        })
    }

    _editNote() {
        this.setState({
            ...this.state,
            expanded: true
        })
    }

    render() {
        const { expanded, text } = this.state;

        return (
            <div className={'position-relative d-block justify-content-center'} >
                <div className={'position-absolute d-flex justify-content-center'} style={{bottom: 0, left: 0, right: 0}}>
                    {
                        expanded ?
                            <div className={'position-relative p-4 pb-2 shadow-lg d-flex flex-column justify-content-center v-gap-3 bg-primary border-muted border'}>
                                <TextEdit
                                    className={"p-0"}
                                    name={"note"}
                                    onChange={this._onUpdateNote}
                                    value={text}/>
                                <div className={'d-flex h-gap-3'}>
                                    <Button text={'Cancel'} onClick={this._onCancelNote}/>
                                    <Button text={'Save'} onClick={this._onSaveNote}/>
                                </div>
                            </div>
                            :
                            <div className={"note d-flex"}>
                                <Button className={"rounded"} onClick={this._editNote}>
                                    <NoteSVG className={"small-image-container"}/>
                                </Button>
                            </div>
                    }
                </div>
            </div>
        )
    }
}
