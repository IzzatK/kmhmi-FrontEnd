import {IPlugin, ISelectionService} from "../../framework.api";
import {IUserService} from "../users/iUserService";
import {IEntityProvider} from "../common/iEntityProvider";
import {
    CitationType,
    ExcerptInfo,
    NoteInfo,
    PocketInfo,
    PocketMapper,
    ReportDocumentInfo,
    ReportInfo
} from "../../app.model";
import {Nullable} from "../../framework.core/extras/typeUtils";
import {IDocumentService} from "../documents/iDocumentService";
import {ExcerptMapper} from "../../app.model";
import {ReportMapper} from "../../app.model";
import {RepoItem} from "../../framework.core/services/repoService/repoItem";
import {nameOf} from "../../framework.core/extras/typeUtils";

export interface IPocketService extends IPlugin {
    /********** begin dependency injection **************************/
    setPocketProvider(provider: IEntityProvider<PocketMapper>): void;
    setExcerptProvider(provider:IEntityProvider<ExcerptInfo>): void;
    setNoteProvider(provider:IEntityProvider<NoteInfo>): void;
    setReportProvider(provider: IEntityProvider<ReportInfo>): void;

    setUserService(userService: IUserService): void;
    setSelectionService(service: ISelectionService): void;
    setDocumentService(service: IDocumentService): void;
    /********** end dependency injection **************************/


    /********** begin pocket methods **************************/
    createPocket(title: string) : void;
    fetchPocket(id: string): void;
    fetchPockets(): void;
    updatePocket(id: string, modifiedPocket: Record<string, any>): void;
    deletePocket(id: string): void;

    getPocketInfos(): Record<string, PocketInfo>;
    getPocketInfo(id: string): Nullable<PocketInfo>;

    getPocketMappers(): Record<string, PocketMapper>;
    getPocketMapper(id: string): Nullable<PocketMapper>;
    /*********** end pocket methods *************************/


    /*********** begin report methods *************************/
    getOrCreateReport(reportParams: ReportParamType): Promise<Nullable<ReportInfo>>;
    removeReport(id: string): void;

    getReport(id:string): Nullable<ReportInfo>;

    getReportMapper(reportId: string): Nullable<ReportMapper>;
    /*********** end report methods *************************/


    /*********** begin report document methods *************************/
    addOrUpdateReportDocument(reportDocumentParams: ReportDocumentParamType): Promise<Nullable<ReportDocumentInfo>>;
    removeReportDocument(id: string): void;

    getReportDocument(id:string): Nullable<ReportDocumentInfo>;
    /*********** end report document methods *************************/


    /*********** begin excerpt methods *************************/
    getOrCreateExcerpt(excerptParams: ExcerptParamType): Promise<Nullable<ExcerptInfo>>;
    removeExcerpt(id: string): void;

    getExcerpt(id:string): Nullable<ExcerptInfo>;
    /*********** end excerpt methods *************************/


    /*********** begin note methods *************************/
    getOrCreateNote(noteParam: NoteParamType): Promise<Nullable<NoteInfo>>;
    removeNote(id: string): void;

    getNote(id:string): Nullable<NoteInfo>;
    /*********** end note methods *************************/



    /*********** begin multi-part methods *************************/

    addNoteToExcerpt(noteParams: NoteParamType, excerptParams: ExcerptParamType, reportDocumentParams: ReportDocumentParamType): void;

    addNoteToReport(noteParams: NoteParamType, reportDocumentParams: ReportDocumentParamType): void;

    addExcerptToReportDocument(excerptParams: ExcerptParamType, reportDocumentParams: ReportDocumentParamType): void;

    addReportToPocket(reportParams: ReportParamType, pocketParams: PocketParamType): void;

    /*********** end multi-part methods *************************/


    //Josiah's requests
    //for the current design, I need a way to create an excerpt and note at the same time - and maybe create a report as well if one does not already exist
    //I'm not really sure at this point what all params need to be passed through
    //it might also be nice to have this method kick off the update pocket api call
    // addOrUpdateExcerpt(reportId: string, documentId: string, excerpt: string, note: string): void;
    //
    // updateReport(id: string, modifiedReport:Record<string, any>): void;
    //
    // deleteExcerpt(id: string): void;
    //
    // deleteNote(id: string): void;
    //
    // updateNote(): void;


    // getReport(id: string): Nullable<ReportInfo>;

    // createExcerpt(reportId: string, documentId: string, text: string, content: string, location:string): void;
}

type OmitParamsType = 'className';

export type ExcerptParamType = Omit<Partial<ExcerptInfo>, OmitParamsType>;
export type NoteParamType = Omit<Partial<NoteInfo>, OmitParamsType>;
export type ReportDocumentParamType = Omit<Partial<ReportDocumentInfo>, OmitParamsType>;
export type ReportParamType = Omit<Partial<ReportInfo>, OmitParamsType>;
export type PocketParamType = Omit<Partial<PocketInfo>, OmitParamsType>;
