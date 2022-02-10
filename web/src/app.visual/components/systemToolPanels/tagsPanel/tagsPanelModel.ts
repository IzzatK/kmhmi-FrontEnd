export type TagsPanelProps = {
    className: string;
    nominatedTags?: Record<string, NominatedTagVM>;
    tags: Record<string, TagInfoVM[]>;
    onTagSelected: (id: string) => void;
}

export type TagsPanelState = {
    selectedTag: string,
}

export type NominatedTagVM = {
    id: string;
    tag: string;
    document: string;
}

export type TagInfoVM = {
    id: string;
    title: string;
    selected?: boolean;
}
