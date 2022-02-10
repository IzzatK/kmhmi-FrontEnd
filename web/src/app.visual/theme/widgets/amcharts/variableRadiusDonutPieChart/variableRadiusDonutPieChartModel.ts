export type VariableRadiusDonutPieChartProps = {
    data: DataVM[];
    className: string;
    divName: string;
    name: string;
    color: string;
    minimized: boolean;
    onSelect?: (id: string) => void;
}

export type VariableRadiusDonutPieChartState = {

}

export type DataVM = {
    item: any;
    count: any;
}
