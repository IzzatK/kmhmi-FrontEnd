export type TagsPanelProps = {
    className: string;
    nominatedTags?: Record<string, NominatedTagVM>;
}

export type TagsPanelState = {
}

export type NominatedTagVM = {
    id: string;
    tag: string;
    document: string;
}
