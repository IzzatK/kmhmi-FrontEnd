import {ReferenceType} from "../../../app.model";

export type SearchGraphsStateProps = {
    className?: string;
    departmentData: StatVM[];
    purposeData: StatVM[];
    totalUploadsData: StatVM[];
    customTagsData: StatVM[];
    docTypeData: StatVM[];
    isExpanded: boolean;
}

export type SearchGraphsDispatchProps = {
    onSearchParamChanged: (id: string, value: string) => void;
}

export type SearchGraphsProps = SearchGraphsDispatchProps & SearchGraphsStateProps;

export type SearchGraphsState = {
    isAlternate: boolean;
}

export type StatVM = {
    id: any;
    type?: any;
    item: any;
    count: any;
}

export type ReferenceInfoVM = {
    id: string;
    title: string;
    type: ReferenceType;
    className: string;
}
