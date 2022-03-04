export type StackedBarChartProps = {
    data: DataVM[];
    className: string;
    divName: string;
    name: string;
    color: string;
    minimized: boolean;
}

export type StackedChartState = {

}

export type DataVM = {
    item: any;
    count: any;
}
