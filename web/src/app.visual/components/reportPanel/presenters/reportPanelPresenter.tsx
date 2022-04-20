import React, {Component} from "react";
import {ReportPanelPresenterProps, ReportPanelPresenterState, ReportUpdateParams} from "../reportPanelModel";
import {bindInstanceMethods} from "../../../../framework.core/extras/utils/typeUtils";
import ReportPanelView from "../views/reportPanelView";
import {forEachKVP} from "../../../../framework.core/extras/utils/collectionUtils";
import {Editor} from "slate";
import {serialize} from "../views/slate/slate-utils";

class ReportPanelPresenter extends Component<ReportPanelPresenterProps, ReportPanelPresenterState> {

    constructor(props: any) {
        super(props);

        bindInstanceMethods(this);

        this.state = {
            tmpReport: {},
            tmpValue: [
                {
                    children: [
                        { text: "" },
                    ],
                },
            ]
        }
    }

    componentDidMount() {
        const { report } = this.props;
        const { id, content } = report;

        this.setState({
            ...this.state,
            tmpReport: { id },
            tmpValue: content,
        })
    }

    componentDidUpdate(prevProps: Readonly<ReportPanelPresenterProps>, prevState: Readonly<ReportPanelPresenterState>, snapshot?: any) {
        const { report } = this.props;

        if (report !== prevProps.report) {
            const { id, content } = report;

            this.setState({
                ...this.state,
                tmpReport: { id },
                tmpValue: content,
            })
        }
    }

    _onTmpReportChanged(name: string, value: any) {
        const { tmpReport } = this.state;
        const { report } = this.props;

        if (report) {
            let nextReport: ReportUpdateParams = {
                ...tmpReport,
                [name]: value
            };

            if (typeof value === 'object') {
                if (report[name] === value) {

                    forEachKVP(tmpReport, (itemKey: keyof ReportUpdateParams, itemValue: any) => {
                        if (name === itemKey) {
                            delete nextReport[itemKey];
                        }
                    });
                }
            } else if (report[name] === value) {
                forEachKVP(tmpReport, (itemKey: keyof ReportUpdateParams, itemValue: any) => {
                    if (name === itemKey) {
                        delete nextReport[itemKey];
                    }
                });
            }
            this._setTmpReport(nextReport);
        }
    }

    _setTmpReport(report: ReportUpdateParams) {
        this.setState({
            ...this.state,
            tmpReport: report,
        })
    }

    _onSaveReport() {
        const { onSaveReport } = this.props;
        const { tmpReport, tmpValue } = this.state;

        const params: ReportUpdateParams = {
            ...tmpReport,
            content: tmpValue,
        }

        if (onSaveReport) {
            onSaveReport(params);
        }
    }

    _onReportValueChanged(value: any) {
        this.setState({
            ...this.state,
            tmpValue: value,
        })
    }

    _onPublishReport(editor: Editor, scope: string) {
        const { onSaveReport } = this.props;
        const { tmpReport, tmpValue } = this.state;

        // console.log(JSON.stringify(editor.children))
        // console.log(serialize(editor));

        let nextReport: ReportUpdateParams = {
            ...tmpReport,
            ["html"]: serialize(editor),
            scope,
        };

        const params: ReportUpdateParams = {
            ...nextReport,
            content: tmpValue,
        }

        if (onSaveReport) {
            onSaveReport(params);
        }
    }

    render() {
        const { report, citations, excerpts } = this.props;
        const { tmpReport, tmpValue } = this.state;

        return (
            <ReportPanelView
                report={report}
                citations={citations}
                excerpts={excerpts}
                onReportValueChanged={this._onReportValueChanged}
                onSaveReport={this._onSaveReport}
                onTmpReportChanged={this._onTmpReportChanged}
                tmpReport={tmpReport}
                tmpValue={tmpValue}
                onPublishReport={this._onPublishReport}
            />
        )
    }
}

export default ReportPanelPresenter
