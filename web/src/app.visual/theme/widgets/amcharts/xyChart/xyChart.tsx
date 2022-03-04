import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import React, {Component} from "react";
import './xyChart.css';
import {XYChartProps, XYChartState} from "./xyChartModel";

am4core.useTheme(am4themes_animated);

export class XYChart extends Component<XYChartProps, XYChartState> {
    private chart: am4charts.XYChart | undefined;

    componentDidMount() {
        const { data, name, color, divName, minimized } = this.props;

        let chart = am4core.create(divName, am4charts.XYChart);

        chart.data = data;

        let xAxis = chart.xAxes.push(new am4charts.DateAxis());
        xAxis.renderer.grid.template.location = 0;

        let yAxis = chart.yAxes.push(new am4charts.ValueAxis());
        yAxis.renderer.minWidth = 35;

        let columnSeries = chart.series.push(new am4charts.ColumnSeries());
        columnSeries.columns.template.fill = am4core.color("#48A8FF");
        columnSeries.dataFields.valueY = "count";
        columnSeries.dataFields.dateX = "item";
        columnSeries.columns.template.width = am4core.percent(60);

        // let lineSeries = chart.series.push(new am4charts.LineSeries());
        // lineSeries.dataFields.dateX = "item";
        // lineSeries.dataFields.valueY = "count";
        // lineSeries.strokeWidth = 4;
        // lineSeries.stroke = am4core.color("#48A8FF");

        chart.scrollbarX = new am4core.Scrollbar();

        this.chart = chart;
    }

    componentDidUpdate(prevProps: Readonly<XYChartProps>, prevState: Readonly<XYChartState>, snapshot?: any) {
        const { data, minimized } = this.props;

        if (this.chart) {
            this.chart.data = data;
        }
    }

    componentWillUnmount() {
        if (this.chart) {
            this.chart.dispose();
        }
    }

    render() {
        const { className, name, color, divName, minimized } = this.props;

        let cn = "xy-chart d-flex flex-column h-100";
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
                    <div className={"legend-title p-3 header-3 cursor-pointer font-weight-semi-bold"} style={{background: color,}}>{name}</div>
                </div>
            </div>

        )
    }
}
