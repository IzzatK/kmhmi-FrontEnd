import * as am4core from "@amcharts/amcharts4/core";
import * as am4plugins_wordCloud from "@amcharts/amcharts4/plugins/wordCloud";
import React, {Component} from "react";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import './wordCloud.css';
import {traceUpdate} from "../../../../../framework.visual/extras/useTraceUpdate";
import {WordCloudProps, WordCloudState} from "./wordCloudModel";

am4core.useTheme(am4themes_animated);

export class WordCloud extends Component<WordCloudProps, WordCloudState> {
    private chart: am4plugins_wordCloud.WordCloud | undefined;
    series: am4plugins_wordCloud.WordCloudSeries | undefined;

    constructor(props: any) {
        super(props);

    }

    componentDidMount() {
        const { data, name, color, divName, minimized } = this.props;

        let chart = am4core.create(divName, am4plugins_wordCloud.WordCloud);

        let series = chart.series.push(new am4plugins_wordCloud.WordCloudSeries());

        series.dataFields.word = "item";
        series.dataFields.value = "count";

        series.data = data;

        this.chart = chart;
        this.series = series;
    }

    componentDidUpdate(prevProps: Readonly<WordCloudProps>, prevState: Readonly<WordCloudState>, snapshot?: any) {
        const { data, minimized } = this.props;

        if (this.series) {
            this.series.data = data;
            traceUpdate(prevProps, prevState, this.props, this.state);
        }
    }

    componentWillUnmount() {
        if (this.chart) {
            this.chart.dispose();
        }
    }

    render() {
        const { className, name, color, divName, minimized } = this.props;

        let cn = "word-cloud d-flex flex-column h-100";
        if (className) {
            cn += ` ${className}`;
        }
        if (minimized) {
            cn += ` minimized`;
        }

        return (
            <div className={cn}>
                <div className={"p-5 w-100 h-100"}>
                    <div id={divName} className={'w-100 h-100'}/>
                </div>
                <div className={"legend d-flex flex-column position-absolute shadow-lg mt-2 ml-3"}>
                    <div className={"legend-title p-3 header-3 cursor-pointer"} style={{background: color,}}>{name}</div>
                </div>
            </div>

        )
    }
}
