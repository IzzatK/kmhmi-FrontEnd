import React, {Component} from "react";
import './draggablePieChart.css';
import * as am4core from "@amcharts/amcharts4/core";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import * as am4charts from "@amcharts/amcharts4/charts";

am4core.useTheme(am4themes_animated);

type Props = {
    data: any;
    className: any;
    divName: string,
    name: string,
    color: string,
    minimized: boolean;
};

type State = {
};

export class DraggablePieChart extends Component<Props, State> {
    private container: any;
    chart1: any;
    chart2: any;
    series1: any;
    series2: any;

    constructor(props: any) {
        super(props);

    }

    componentDidMount() {
        const { data, name, color, divName, minimized } = this.props;

        let container = am4core.create(divName, am4charts.PieChart3D);

        container.layout = "horizontal";

        container.events.on("maxsizechanged", function () {
            chart1.zIndex = 0;
            separatorLine.zIndex = 1;
            dragText.zIndex = 2;
            chart2.zIndex = 3;
        });

        let chart1 = container.createChild(am4charts.PieChart3D);
        chart1.hiddenState.properties.opacity = 0;//initial animation
        chart1.data = data;
        chart1.zIndex = 1;
        chart1.innerRadius = am4core.percent(40);
        chart1.depth = 4;

        let series1 = chart1.series.push(new am4charts.PieSeries3D());
        series1.dataFields.value = "count";
        series1.dataFields.category = "item";
        series1.colors.step = 2;
        series1.slices.template.tooltipText = "";
        // series1.alignLabels = false;
        // series1.labels.template.bent = true;

        series1.hiddenState.properties.endAngle = -90;//initial animation

        let sliceTemplate1 = series1.slices.template;
        sliceTemplate1.cornerRadius = 5;
        sliceTemplate1.draggable = true;
        sliceTemplate1.inert = true;
        sliceTemplate1.propertyFields.fill = "color";
        sliceTemplate1.propertyFields.fillOpacity = "opacity";
        sliceTemplate1.propertyFields.stroke = "color";
        sliceTemplate1.propertyFields.strokeDasharray = "strokeDasharray";
        sliceTemplate1.strokeWidth = 1;
        sliceTemplate1.strokeOpacity = 1;

        let zIndex = 5;

        sliceTemplate1.events.on("down", function (event: any) {
            event.target.toFront();
            // also put chart to front
            let series = event.target.dataItem.component;
            series.chart.zIndex = zIndex++;
        });

        series1.labels.template.propertyFields.disabled = "disabled";
        series1.ticks.template.propertyFields.disabled = "disabled";

        // @ts-ignore
        sliceTemplate1.states.getKey("active").properties.shiftRadius = 0;

        sliceTemplate1.events.on("dragstop", (event: any) => this.handleDragStop(event));

        let separatorLine = container.createChild(am4core.Line);
        separatorLine.x1 = 0;
        separatorLine.y2 = 300;
        separatorLine.strokeWidth = 3;
        separatorLine.stroke = am4core.color("#dadada");
        separatorLine.valign = "middle";
        separatorLine.strokeDasharray = "5,5";
        separatorLine.paddingLeft = 200;

        let dragText = container.createChild(am4core.Label);
        dragText.text = "Drag slices over the line";
        dragText.rotation = 90;
        dragText.valign = "middle";
        dragText.align = "center";
        dragText.paddingBottom = 5;
        dragText.paddingRight = 200;

        let chart2 = container.createChild(am4charts.PieChart3D);
        chart2.hiddenState.properties.opacity = 0; // this makes initial fade in effect
        chart2.data = data;
        chart2.zIndex = 1;
        chart2.innerRadius = am4core.percent(40);
        chart2.depth = 4;

        let series2 = chart2.series.push(new am4charts.PieSeries3D());
        series2.dataFields.value = "count";
        series2.dataFields.category = "item";
        series2.colors.step = 2;

        let sliceTemplate2 = series2.slices.template;
        sliceTemplate2.copyFrom(sliceTemplate1);

        series2.labels.template.propertyFields.disabled = "disabled";
        series2.ticks.template.propertyFields.disabled = "disabled";

        series2.events.on("datavalidated", function () {
            let dummyDataItem = series2.dataItems.getIndex(0);
            if (dummyDataItem) {
                dummyDataItem.show(0);
                dummyDataItem.slice.draggable = false;
                dummyDataItem.slice.tooltipText = "";
            }


            for (let i = 1; i < series2.dataItems.length; i++) {
                // @ts-ignore
                series2.dataItems.getIndex(i).hide(0);
            }
        });

        series1.events.on("datavalidated", function () {
            let dummyDataItem = series1.dataItems.getIndex(0);
            if (dummyDataItem) {
                dummyDataItem.hide(0);
                dummyDataItem.slice.draggable = false;
                dummyDataItem.slice.tooltipText = "";
            }

        });

        this.container = container;
        this.chart1 = chart1;
        this.chart2 = chart2;
        this.series1 = series1;
        this.series2 = series2;
    }

    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any) {
        const { data, minimized } = this.props;

        if (this.chart1) {
            this.chart1.data = data;
            if (this.series1) {
                this.toggleDummySlice(this.series1);
            }

        }
        if (this.chart2) {
            this.chart2.data = data;
            if (this.series2) {
                this.toggleDummySlice(this.series2);
            }


        }
    }

    componentWillUnmount() {
        if (this.container) {
            this.container.dispose();
        }
    }

    handleDragStop(event: any) {
        let targetSlice = event.target;
        let dataItem1;
        let dataItem2;
        let slice1: any;
        let slice2: any;

        if (this.series1.slices.indexOf(targetSlice) != -1) {
            slice1 = targetSlice;
            slice2 = this.series2.dataItems.getIndex(targetSlice.dataItem.index).slice;
        } else if (this.series2.slices.indexOf(targetSlice) != -1) {
            slice2 = targetSlice;
            slice1 = this.series1.dataItems.getIndex(targetSlice.dataItem.index).slice;

        }

        dataItem1 = slice1.dataItem;
        dataItem2 = slice2.dataItem;

        let series1Center = am4core.utils.spritePointToSvg(
            { x: 0, y: 0 },
            this.series1.slicesContainer
        );
        let series2Center = am4core.utils.spritePointToSvg(
            { x: 0, y: 0 },
            this.series2.slicesContainer
        );

        let series1CenterConverted = am4core.utils.svgPointToSprite(
            series1Center,
            this.series2.slicesContainer
        );
        let series2CenterConverted = am4core.utils.svgPointToSprite(
            series2Center,
            this.series1.slicesContainer
        );

        // tooltipY and tooltipY are in the middle of the slice, so we use them to avoid extra calculations
        let targetSlicePoint = am4core.utils.spritePointToSvg(
            { x: targetSlice.tooltipX, y: targetSlice.tooltipY },
            targetSlice
        );

        if (targetSlice == slice1) {
            if (targetSlicePoint.x > this.container.pixelWidth / 2) {
                let value = dataItem1.value;

                dataItem1.hide();

                let animation = slice1.animate(
                    [
                        { property: "x", to: series2CenterConverted.x },
                        { property: "y", to: series2CenterConverted.y }
                    ],
                    400
                );
                animation.events.on("animationprogress", function (event: any) {
                    slice1.hideTooltip();
                });

                slice2.x = 0;
                slice2.y = 0;

                dataItem2.show();
            } else {
                slice1.animate(
                    [
                        { property: "x", to: 0 },
                        { property: "y", to: 0 }
                    ],
                    400
                );
            }
        }
        if (targetSlice == slice2) {
            if (targetSlicePoint.x < this.container.pixelWidth / 2) {
                let value = dataItem2.value;

                dataItem2.hide();

                let animation = slice2.animate(
                    [
                        { property: "x", to: series1CenterConverted.x },
                        { property: "y", to: series1CenterConverted.y }
                    ],
                    400
                );
                animation.events.on("animationprogress", function (event: any) {
                    slice2.hideTooltip();
                });

                slice1.x = 0;
                slice1.y = 0;
                dataItem1.show();
            } else {
                slice2.animate(
                    [
                        { property: "x", to: 0 },
                        { property: "y", to: 0 }
                    ],
                    400
                );
            }
        }

        if (this.series1) {
            this.toggleDummySlice(this.series1);
        }

        if (this.series2) {
            this.toggleDummySlice(this.series2);
        }


        this.series1.hideTooltip();
        this.series2.hideTooltip();
    }

    toggleDummySlice(series: any) {
        let show = true;
        for (let i = 1; i < series.dataItems.length; i++) {
            let dataItem = series.dataItems.getIndex(i);
            if (dataItem.slice.visible && !dataItem.slice.isHiding) {
                show = false;
            }
        }

        let dummySlice = series.dataItems.getIndex(0);

        try {
            if (show) {
                dummySlice.show();
            } else {
                dummySlice.hide();
            }
        } catch (e) {
            console.log(e);
        }

    }

    render() {
        const { className, name, color, divName, minimized } = this.props;

        let cn = "draggable-pie-chart d-flex flex-column h-100";
        if (className) {
            cn += ` ${className}`;
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
