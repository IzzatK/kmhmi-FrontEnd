import {
    highlightPlugin,
    HighlightPlugin,
    RenderHighlightContentProps,
    RenderHighlightsProps,
    RenderHighlightTargetProps,
    Trigger
} from "@react-pdf-viewer/highlight";
import {DocumentPdfPreviewProps, ExcerptVM} from "./documentPanelModel";
import React, {Component, useMemo} from "react";
import Button from "../../theme/widgets/button/button";
import {NoteSVG} from "../../theme/svgs/noteSVG";
import {DeleteSVG} from "../../theme/svgs/deleteSVG";
import ComboBox from "../../theme/widgets/comboBox/comboBox";
import TextArea from "../../theme/widgets/textEdit/textArea";
import {forEach} from "../../../framework.core/extras/utils/collectionUtils";
import {bindInstanceMethods} from "../../../framework.core/extras/utils/typeUtils";
//
// export const MyHighlightPlugin = (props: DocumentPdfPreviewProps): HighlightPlugin => {
//     return useMemo(() => {
//         return highlightPlugin(
//             {
//                 renderHighlightTarget: (pluginProps: RenderHighlightTargetProps) => renderHighlightTarget(pluginProps, props),
//                 renderHighlightContent: (pluginProps: RenderHighlightContentProps) => renderHighlightContent(pluginProps, props),
//                 renderHighlights: (pluginProps: RenderHighlightsProps) => renderHighlights(pluginProps, props),
//             })
//     }, [props]);
// };

export function renderHighlightTarget(pluginProps: RenderHighlightTargetProps, props: DocumentPdfPreviewProps) {
    return (
        <div className={"note position-absolute d-flex"}
             style={{
                 left: `${pluginProps.selectionRegion.left}%`,
                 top: `${pluginProps.selectionRegion.top + pluginProps.selectionRegion.height}%`,
             }}
        >
            <Button className={"btn-transparent"} onClick={pluginProps.toggle}>
                <NoteSVG className={"small-image-container"}/>
            </Button>
        </div>
    );
};

export function renderHighlightContent(pluginProps: RenderHighlightContentProps, props: DocumentPdfPreviewProps) {
    const addNote = () => {
        if (props.onSaveExcerpt) {
            props.onSaveExcerpt(pluginProps.selectedText, pluginProps.highlightAreas);
        }
        pluginProps.cancel();
    };

    let pocketId = props.tmpExcerpt["pocket"] ? props.tmpExcerpt["pocket"] : "";
    let pocketTitle = "";
    if (props.pockets && props.pockets[pocketId]) {
        pocketTitle = props.pockets[pocketId].title;
    } else {
        pocketTitle = pocketId;
    }

    let note = props.tmpExcerpt["note"] ? props.tmpExcerpt["note"] : "";

    const _onSaveNote = (message: string) => {
        if (props.onSaveNote) {
            props.onSaveNote(message);
        }
    }

    const _onPocketSelectionChanged = (id: string) => {
        if (props.onPocketSelectionChanged) {
            props.onPocketSelectionChanged(id);
        }
    }

    return (
        <div
            className={"popup d-flex flex-column bg-accent rounded position-absolute"}
            style={{
                top: `${pluginProps.selectionRegion.top + pluginProps.selectionRegion.height}%`,
            }}
        >
            <div className={"d-flex flex-column v-gap-2 p-3 position-relative"}>
                <div className={"position-absolute close"}>
                    <Button className={"btn-transparent"} onClick={pluginProps.cancel}>
                        <DeleteSVG className={"nano-image-container"}/>
                    </Button>

                </div>
                <div className={"header-3"}>Excerpt</div>
                <ComboBox
                    items={props.pockets}
                    title={pocketTitle}
                    onSelect={ _onPocketSelectionChanged }
                />
                <TextArea
                    className={"p-0"}
                    name={"note"}
                    onChange={ _onSaveNote }
                    value={note}
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
};

export function renderHighlights(pluginProps: RenderHighlightsProps, props: DocumentPdfPreviewProps) {
    const highlights: JSX.Element[] = [];

    let documentHighlights: any[] = [];

    forEach(props.excerpts, (excerpt: ExcerptVM) => {
        let note = JSON.parse(excerpt.content);
        documentHighlights.push(note);
    })
    //
    // forEach(props.excerpts, (excerpt: ExcerptVM) => {
    //     const note: any[] = excerpt.content;
    //
    //     let result = (
    //         <React.Fragment key={JSON.stringify(note)}>
    //             {note
    //                 // Filter all highlights on the current page
    //                 .filter((area: any) => area.pageIndex === pluginProps.pageIndex)
    //                 .map((area: any, idx: any) => (
    //                     <div
    //                         key={idx}
    //                         style={Object.assign(
    //                             {},
    //                             {
    //                                 background: 'yellow',
    //                                 opacity: 0.4,
    //                             },
    //                             pluginProps.getCssProperties(area, pluginProps.rotation)
    //                         )}
    //                     />
    //                 ))}
    //         </React.Fragment>
    //     )
    //     highlights.push(result);
    // })

    return (
        <div>
            {documentHighlights?.map((note: any[]) => (
                <React.Fragment key={JSON.stringify(note)}>
                    {note
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
                                )}
                            >
                                {
                                    idx == 0 &&
                                    <NoteRenderer/>
                                }
                            </div>
                        ))}
                </React.Fragment>
            ))}
        </div>
    );
}

type NoteRendererProps = {

}

type NoteRendererState = {
    expanded: boolean
}

class NoteRenderer extends Component<NoteRendererProps, NoteRendererState> {


    constructor(props: NoteRendererProps) {
        super(props);

        bindInstanceMethods(this);

        this.state = {
            expanded: false
        }
    }

    _toggleExpanded() {
        let nextExpanded = !this.state.expanded;

        this.setState({
            ...this.state,
            expanded: nextExpanded
        })
    }

    render() {
        return (
            <div className={'position-relative d-flex justify-content-center'} >
                <div className={'position-absolute d-flex justify-content-center'} style={{bottom: 0, left: 0, right: 0}}>
                    {
                        this.state.expanded ?
                            <div className={'p-4 pb-2 shadow-lg d-flex flex-column justify-content-center v-gap-3 bg-primary border-muted border'}>
                                <div className={'text-secondary display-4'}>Hello World</div>
                                <div className={'d-flex h-gap-3'}>
                                    <Button text={'Cancel'} onClick={this._toggleExpanded}/>
                                    <Button text={'Save'} onClick={this._toggleExpanded}/>
                                </div>
                            </div>
                            :
                            <div className={'p-4 pb-1'}>
                                <Button text={'Note Here'} onClick={this._toggleExpanded}/>
                            </div>

                    }
                </div>
            </div>
        )
    }
}
