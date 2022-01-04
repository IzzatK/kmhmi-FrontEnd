export type DonutPieChartProps = {
    data: DataVM[];
    className: string;
    divName: string;
    name: string;
    color: string;
    minimized: boolean;
}

export type DonutPieChartState = {

}

export type DataVM = {
    item: any;
    count: any;
}
