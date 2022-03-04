import React, {Component} from "react";
import './listChart.css';
import {ListChartProps, ListChartState} from "./listChartModel";

export class ListChart extends Component<ListChartProps, ListChartState> {

    componentDidMount() {
    }

    componentDidUpdate(prevProps: Readonly<ListChartProps>, prevState: Readonly<ListChartState>, snapshot?: any) {

    }

    componentWillUnmount() {

    }

    render() {
        const { className, name, color, data, minimized } = this.props;

        let cn = "xy-chart d-flex flex-column h-100";
        if (className) {
            cn += ` ${className}`;
        }
        if (minimized) {
            cn += ` minimized`;
        }

        let counter = 0;

        let itemDivs = data.map((item: string) => {
            if (counter <= 6) {
                return (
                    <div className={"display-1"}>{item}</div>
                )
            }
            counter++;
        })

        return (
            <div className={cn}>
                <div className={"p-5 w-100 h-100 v-gap-3 mt-5"}>
                    {itemDivs}
                </div>
                <div className={"legend d-flex flex-column position-absolute shadow-lg mt-2 ml-3"}>
                    <div className={"legend-title p-3 header-3 cursor-pointer font-weight-semi-bold"} style={{background: color,}}>{name}</div>
                </div>
            </div>

        )
    }
}
