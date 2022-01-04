export type XYChartProps = {
    data: DataVM[];
    className: string;
    divName: string;
    name: string;
    color: string;
    minimized: boolean;
}

export type XYChartState = {

}

export type DataVM = {
    item: any;
    count: any;
}
