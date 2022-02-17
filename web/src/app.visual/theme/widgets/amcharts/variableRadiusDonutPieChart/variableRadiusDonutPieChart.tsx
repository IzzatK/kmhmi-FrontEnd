import React, {Component} from "react";
import './variableRadiusDonutPieChart.css';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import {VariableRadiusDonutPieChartProps, VariableRadiusDonutPieChartState} from "./variableRadiusDonutPieChartModel";

export class VariableRadiusDonutPieChart extends Component<VariableRadiusDonutPieChartProps, VariableRadiusDonutPieChartState> {
    private chart: am4charts.PieChart3D | undefined;
    series: am4charts.PieSeries3D | undefined;

    constructor(props: any) {
        super(props);

    }

    componentDidMount() {
        const { data, name, color, divName, minimized } = this.props;

        let chart = am4core.create(divName, am4charts.PieChart3D);

        chart.hiddenState.properties.opacity = 0;//initial animation

        // chart.startAngle = 160;
        // chart.endAngle = 380;
        chart.innerRadius = am4core.percent(40);
        chart.depth = 10;

        let series = chart.series.push(new am4charts.PieSeries3D());
        series.dataFields.value = "count";
        series.dataFields.category = "item";
        // series.dataFields.depthValue = "count";
        series.dataFields.radiusValue = "count";
        series.colors.step = 3;

        // Configure tooltips
        series.slices.template.tooltipText = "{item}: {count}";
        series.slices.template.tooltipX = am4core.percent(50);
        series.slices.template.tooltipY = am4core.percent(50);

        // Disable ticks and labels
        series.labels.template.disabled = true;
        series.ticks.template.disabled = true;

        series.hiddenState.properties.endAngle = -90;//initial animation

        series.slices.template.events.on('hit', function(ev) {
            if (this.props.onSelect != null) {
                // const { id } = ev.target?.dataItem?.dataContext || {};

                const params = ev.target.dataItem?.dataContext as { id: string}
                if (params != null) {
                    this.props.onSelect(params.id);
                }
            }
        }, this);

        // Configure legend
        chart.legend = new am4charts.Legend();
        chart.legend.position = "right";
        chart.legend.maxHeight = 230;
        chart.legend.scrollable = true;
        chart.legend.itemContainers.template.paddingTop = 5;
        chart.legend.itemContainers.template.paddingBottom = 5;
        chart.legend.labels.template.truncate = false;
        chart.legend.labels.template.wrap = true;

        chart.data = data;

        this.chart = chart;
        this.series = series;
    }

    componentDidUpdate(prevProps: Readonly<VariableRadiusDonutPieChartProps>, prevState: Readonly<VariableRadiusDonutPieChartState>, snapshot?: any) {
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

        let cn = "variable-radius-donut-pie-chart d-flex flex-column h-100";
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
