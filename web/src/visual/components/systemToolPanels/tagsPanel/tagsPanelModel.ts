export type TagsPanelProps = {
    className: string;
    nominatedTags?: Record<string, NominatedTagVM>;
    tags: Record<string, TagInfoVM>
}

export type TagsPanelState = {
}

export type NominatedTagVM = {
    id: string;
    tag: string;
    document: string;
}

export type TagInfoVM = {
    id: string;
    title: string;
}
