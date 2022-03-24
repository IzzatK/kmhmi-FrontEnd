import React, {Component} from "react";
import './reportPanel.css';
import {ReportPanelPresenterProps, ReportPanelPresenterState} from "../reportPanelModel";
import {bindInstanceMethods} from "../../../../framework.core/extras/utils/typeUtils";
import Button from "../../../theme/widgets/button/button";
import ComboBox from "../../../theme/widgets/comboBox/comboBox";
import TextEdit from "../../../theme/widgets/textEdit/textEdit";

class ReportPanelView extends Component<ReportPanelPresenterProps, ReportPanelPresenterState> {

    constructor(props: any) {
        super(props);

        bindInstanceMethods(this);

        this.state = {
            tmpReport: {},
        }
    }

    componentDidMount() {

    }

    componentDidUpdate(prevProps: Readonly<ReportPanelPresenterProps>, prevState: Readonly<ReportPanelPresenterState>, snapshot?: any) {

    }

    _onTmpReportChanged(name: string, value: string) {

    }

    _onSaveReport() {

    }

    render() {
        const { className, report, excerpts, citations } = this.props;
        const { tmpReport } = this.state;

        const { id, pocketId, authorId, title, date, citation } = report || {};
        const { id: tmpId, pocketId: tmpPocketId, authorId: tmpAuthorId, title: tmpTitle, date: tmpDate, citation: tmpCitation } = tmpReport;

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

        return (
            <div className={cn}>
                <div className={'d-flex flex-fill flex-column align-items-stretch'}>
                    {/*<div className={'header-1 title py-4 pl-5'}>REPORT INFORMATION</div>*/}
                    <div className={`header position-relative`}>
                        <div className={`d-flex flex-column p-4 v-gap-5 position-relative ${!id && 'disabled'} `}>
                            <div className={"d-flex flex-column v-gap-1 header-1"}>
                                <div className={'property-grid'}>
                                    <div className={'d-flex align-items-center h-gap-4'}>
                                        <div className={'header-1 font-weight-semi-bold text-right label'}>Title:</div>
                                        <TextEdit
                                            className={'text-field'}
                                            placeholder={'Title goes here'}
                                            name={'title'}
                                            value={titleValue}
                                            disable={id === undefined}
                                            edit={id !== undefined}
                                            onSubmit={this._onTmpReportChanged}
                                        />
                                    </div>

                                    <div className={'d-flex align-items-center h-gap-4'}>
                                        <div className={'header-1 font-weight-semi-bold text-right label'}>Date:</div>
                                        <TextEdit
                                            className={'text-field'}
                                            type={'date'}
                                            placeholder={'Date goes here'}
                                            name={'date'}
                                            value={dateValue}
                                            disable={id === undefined}
                                            edit={id !== undefined}
                                            onSubmit={(name, value) => this._onTmpReportChanged(name, value)}
                                        />
                                    </div>

                                    <div className={'d-flex align-items-center h-gap-4'}>
                                        <div/>
                                        <div/>
                                    </div>

                                    <div className={'d-flex align-items-center h-gap-4'}>
                                        <div className={'header-1 font-weight-semi-bold text-right label'}>Style:</div>
                                        <ComboBox
                                            title={citationTitle}
                                            items={Object.values(citations)}
                                            onSelect={(value: string) => this._onTmpReportChanged('citation', value)}
                                        />
                                    </div>
                                </div>
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
                            id ?
                                <div>
                                    {/*report builder goes here*/}
                                </div>
                                :
                                <div
                                    className={'flex-fill d-flex flex-column align-items-center justify-content-center v-gap-5 bg-tertiary'}>
                                    <div className={'display-4 text-accent font-weight-semi-bold'}>No Report Available
                                    </div>
                                    <div className={'header-2 text-info font-weight-light'}>(Select a report to edit)</div>
                                </div>
                        }
                    </div>
                    {
                        id &&
                        <div className={'d-flex align-items-center justify-content-end h-gap-2 bg-selected py-3 px-5'}>
                            <Button
                                light={true}
                                text={'Save'}
                                onClick={() => this._onSaveReport()}/>
                        </div>
                    }
                </div>
            </div>
        )

    }
}

export default ReportPanelView
