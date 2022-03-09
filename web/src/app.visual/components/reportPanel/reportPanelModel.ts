export type ReportPanelProps = {
    className?: string;
    report: ReportInfoVM;
    citations: Record<string, CitationVM>;
    excerpts: Record<string, ExcerptVM>;
}

export type ReportPanelState = {
    tmpReport: ReportInfoVM;
}

export type ReportInfoVM = {
    id?: string;
    pocketId?: string;
    authorId?: string;
    title?: string;
    date?: string;
    citation?: string;
    documents?: Record<string, DocumentVM>;
}

export type CitationVM = {
    title: string;
}

export type NoteVM = {
    text: string;
    content: string;
    author_id: string;
}

export type ExcerptVM = {
    text?: string;
    content?: string;
    location?: string;
    authorId?: string;
    notes: Record<string, NoteVM>;
}

export type DocumentVM = {
    title?: string,
    author?: string,
    file_name?: string,
    publication_date?: string,
    upload_date?: string,
}
