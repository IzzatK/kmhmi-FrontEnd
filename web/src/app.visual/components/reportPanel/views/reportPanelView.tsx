import React, {Component} from "react";
import './reportPanel.css';
import {ReportPanelViewProps} from "../reportPanelModel";
import Button from "../../../theme/widgets/button/button";
import TextEdit from "../../../theme/widgets/textEdit/textEdit";
import {RichTextEditView} from "./richTextEditView";

class ReportPanelView extends Component<ReportPanelViewProps> {
    render() {
        const { className, report, tmpReport, tmpValue, excerpts, citations, onTmpReportChanged, onSaveReport, onReportValueChanged } = this.props;

        const { id, pocketId, authorId, title, date, citation } = report || {};
        const { id: tmpId, author_id: tmpAuthorId, title: tmpTitle, publication_date: tmpDate, citation: tmpCitation } = tmpReport;

        let cn = "report-panel d-flex flex-column";
        if (className) {
            cn += ` ${className}`;
        }

        let originalTitle = title || "";
        let titleValue = tmpTitle || originalTitle;

        let originalDate = date || "";
        let dateValue = tmpDate || originalDate;

        let citationTitle: string;
        if (citation && citations && citations[citation]) {
            citationTitle = citations[citation].title;
        }
        else {
            citationTitle = 'Select Style';
        }

        //${!id && 'disabled'}

        return (
            <div className={cn}>
                <div className={'d-flex flex-fill flex-column align-items-stretch'}>
                    <div className={`d-flex flex-column v-gap-3 header position-relative px-5 py-4`}>
                        <div className={'d-flex justify-content-between'}>
                            <div className={'header-1 title'}>REPORT INFORMATION</div>
                            <div className={'d-flex h-gap-3'}>
                                {/*<Button text={'Cancel'}/>*/}
                                {/*<Button text={'Save'}/>*/}
                            </div>
                        </div>
                        <div className={`d-flex h-gap-5`}>
                            <div className={'flex-fill d-flex align-items-center h-gap-3'}>
                                <div className={'header-1 font-weight-semi-bold text-right label'}>Title:</div>
                                <TextEdit
                                    className={'flex-fill text-field'}
                                    placeholder={'Title goes here'}
                                    name={'title'}
                                    value={titleValue}
                                    // disable={id === undefined}
                                    // edit={id !== undefined}
                                    onSubmit={onTmpReportChanged}
                                />
                            </div>

                            <div className={'d-flex align-items-center h-gap-3'}>
                                <div className={'header-1 font-weight-semi-bold text-right label'}>Date:</div>
                                <TextEdit
                                    className={'text-field'}
                                    type={'date'}
                                    placeholder={'Date goes here'}
                                    name={'date'}
                                    value={dateValue}
                                    // disable={id === undefined}
                                    // edit={id !== undefined}
                                    onSubmit={onTmpReportChanged}
                                />
                            </div>

                        </div>

                        {/*{*/}
                        {/*    isUpdating &&*/}
                        {/*    <div className={"position-absolute"} style={{top: '0', right: '0', bottom: '0', left:'0'}}>*/}
                        {/*        <LoadingIndicator/>*/}
                        {/*    </div>*/}
                        {/*}*/}
                    </div>
                    <div className={"body flex-fill d-flex align-self-stretch position-relative"}>
                        {
                            // id ?
                                <RichTextEditView
                                    value={tmpValue}
                                    onReportValueChanged={onReportValueChanged}
                                />
                                // :
                                // <div
                                //     className={'flex-fill d-flex flex-column align-items-center justify-content-center v-gap-5 bg-tertiary'}>
                                //     <div className={'display-4 text-accent font-weight-semi-bold'}>No Report Available
                                //     </div>
                                //     <div className={'header-2 text-info font-weight-light'}>(Select a report to edit)</div>
                                // </div>
                        }
                    </div>
                    {
                        id &&
                        <div className={'d-flex align-items-center justify-content-end h-gap-2 bg-selected py-3 px-5'}>
                            <Button
                                light={true}
                                text={'Save'}
                                onClick={onSaveReport}/>
                        </div>
                    }
                </div>
            </div>
        )

    }
}

export default ReportPanelView
