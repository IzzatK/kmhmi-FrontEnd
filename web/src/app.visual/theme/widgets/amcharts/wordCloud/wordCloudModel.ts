export type WordCloudProps = {
    data: DataVM[];
    className: string;
    divName: string;
    name: string;
    color: string;
    minimized: boolean;
    onSelect?: (id: string) => void;
}

export type WordCloudState = {

}

export type DataVM = {
    item: any;
    count: any;
}
