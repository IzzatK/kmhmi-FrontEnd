import {ReferenceType} from "../../../app.model";

export type SearchGraphsPanelAppStateProps = {
    className?: string;
    departmentData: StatVM[];
    purposeData: StatVM[];
    totalUploadsData: StatVM[];
    customTagsData: StatVM[];
    docTypeData: StatVM[];
    isExpanded: boolean;
}

export type SearchGraphsPanelAppDispatchProps = {
    onSearchParamChanged: (id: string, value: string) => void;
}

export type SearchGraphsPanelPresenterProps = SearchGraphsPanelAppDispatchProps & SearchGraphsPanelAppStateProps;

export type SearchGraphsPanelPresenterState = {
    isAlternate: boolean;
}

export type SearchGraphsPanelViewProps = {
    className?: string;
    departmentData: StatVM[];
    purposeData: StatVM[];
    totalUploadsData: StatVM[];
    customTagsData: StatVM[];
    docTypeData: StatVM[];
    isExpanded: boolean;
    isAlternate: boolean;
    onSearchParamChanged: (id: string, value: string) => void;
    onToggleAlternate: () => void;
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
