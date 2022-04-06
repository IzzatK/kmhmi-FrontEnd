import {ReportInfo} from "../../../app.model";

export type ReportPanelAppStateProps = {
    report: ReportInfoVM;
    citations: Record<string, CitationVM>;
    excerpts: Record<string, ExcerptVM>;
}

export type ReportPanelAppDispatchProps = {
    onSaveReport: (edits: ReportUpdateParams) => void;
}

export type ReportPanelPresenterProps = ReportPanelAppStateProps & ReportPanelAppDispatchProps;

export type ReportPanelPresenterState = {
    tmpReport: ReportUpdateParams;
    tmpValue: any;
}

export type ReportPanelViewProps = {
    className?: string;
    report: ReportInfoVM;
    tmpReport: ReportUpdateParams;
    tmpValue: any;
    citations: Record<string, CitationVM>;
    excerpts: Record<string, ExcerptVM>;
    onTmpReportChanged: (name: string, value: any) => void;
    onReportValueChanged: (value: any) => void;
    onSaveReport: () => void;
}

export type RichTextEditViewProps = {
    value: any;
    onReportValueChanged: (value: any) => void;
}

export type ReportInfoVM = {
    [key: string]: any;
    id?: string;
    pocket_id?: string;
    author_id?: string;
    title?: string;
    date?: string;
    citation?: string;
    documents?: Record<string, DocumentVM>;
    value?: any;
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

export type ReportUpdateParams = Partial<Record<keyof Omit<ReportInfo, 'className'>, any>>;
