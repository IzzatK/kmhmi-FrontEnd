import {
    highlightPlugin,
    HighlightPlugin,
    RenderHighlightContentProps,
    RenderHighlightsProps,
    RenderHighlightTargetProps,
    Trigger
} from "@react-pdf-viewer/highlight";
import {DocumentPdfPreviewProps} from "./documentPanelModel";
import React, {useMemo} from "react";
import Button from "../../theme/widgets/button/button";
import {NoteSVG} from "../../theme/svgs/noteSVG";
import {DeleteSVG} from "../../theme/svgs/deleteSVG";
import ComboBox from "../../theme/widgets/comboBox/comboBox";
import TextArea from "../../theme/widgets/textEdit/textArea";
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
    debugger;
    console.log(JSON.stringify(pluginProps))
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
        if (props.tmpMethod) {
            props.tmpMethod(pluginProps.selectedText, pluginProps.highlightAreas);
        }
        pluginProps.cancel();
    };


    // console.log("pockets3=" + JSON.stringify(tmp.pockets));

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
    // console.log("renderHighlights " + JSON.stringify(tmp.documentHighlightAreas))
    return (
        <div>
            {props.documentHighlightAreas?.map((note: any[]) => (
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
                                        background: 'yellow',
                                        opacity: 0.4,
                                    },
                                    pluginProps.getCssProperties(area, pluginProps.rotation)
                                )}
                            />
                        ))}
                </React.Fragment>
            ))}
        </div>
    );
}