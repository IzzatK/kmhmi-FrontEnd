import React, {Component} from "react";
import {ReportPanelPresenterProps, ReportPanelPresenterState} from "../reportPanelModel";
import {bindInstanceMethods} from "../../../../framework.core/extras/utils/typeUtils";
import ReportPanelView from "../views/reportPanelView";

class ReportPanelPresenter extends Component<ReportPanelPresenterProps, ReportPanelPresenterState> {

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
        return (
            <ReportPanelView report={this.props.report} citations={this.props.citations} excerpts={this.props.excerpts}/>
        )
    }
}

export default ReportPanelPresenter
