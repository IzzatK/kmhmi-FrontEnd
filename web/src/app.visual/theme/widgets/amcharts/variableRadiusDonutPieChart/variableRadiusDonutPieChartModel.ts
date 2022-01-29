export type VariableRadiusDonutPieChartProps = {
    data: DataVM[];
    className: string;
    divName: string;
    name: string;
    color: string;
    minimized: boolean;
}

export type VariableRadiusDonutPieChartState = {

}

export type DataVM = {
    item: any;
    count: any;
}
