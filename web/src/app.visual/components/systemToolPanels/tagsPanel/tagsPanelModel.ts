export type TagsPanelAppStateProps = {
    className?: string;
    nominatedTags: Record<string, NominatedTagVM>;
    tags: Record<string, TagInfoVM[]>;
}

export type TagsPanelAppDispatchProps = {
    onTagSelected: (id: string) => void;
}

export type TagsPanelPresenterProps = TagsPanelAppStateProps & TagsPanelAppDispatchProps;

export type TagsPanelPresenterState = {
    selectedTag: string,
}

export type TagsPanelViewProps = {
    className?: string;
    nominatedTags: Record<string, NominatedTagVM>;
    tags: Record<string, TagInfoVM[]>;
    selectedTag: string,
    onShouldClose: (id: string) => void;
    onTagSelected: (id: string) => void;
};

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
