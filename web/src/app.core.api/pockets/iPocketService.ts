import {IPlugin, ISelectionService} from "../../framework.core.api";
import {IUserService} from "../users/iUserService";
import {IEntityProvider} from "../../framework.core.api/iEntityProvider";
import {
    ExcerptInfo,
    NoteInfo,
    PocketInfo,
    PocketMapper,
    ResourceInfo,
    ReportInfo
} from "../../app.model";
import {Nullable} from "../../framework.core/extras/utils/typeUtils";
import {IDocumentService} from "../documents/iDocumentService";

export interface IPocketService extends IPlugin {
    /********** begin dependency injection **************************/
    setPocketProvider(provider: IEntityProvider<PocketMapper>): void;
    setResourceProvider(provider: IEntityProvider<ResourceInfo>): void;
    setExcerptProvider(provider:IEntityProvider<ExcerptInfo>): void;
    setNoteProvider(provider:IEntityProvider<NoteInfo>): void;

    setUserService(userService: IUserService): void;
    setSelectionService(service: ISelectionService): void;
    setDocumentService(service: IDocumentService): void;
    /********** end dependency injection **************************/


    /********** begin pocket methods **************************/
    addOrUpdatePocket(params: PocketParamType, updateLocal?: boolean): Promise<Nullable<PocketMapper>>;
    removePocket(id: string): void;

    fetchPocket(id: string): void;
    fetchPockets(): void;

    getPocketMappers(): Record<string, PocketMapper>;
    getPocketMapper(id:string): Nullable<PocketMapper>;

    getPocketInfos(): Record<string, PocketInfo>;
    getPocketInfo(id: string): Nullable<PocketInfo>;

    /*********** end pocket methods *************************/


    /*********** begin resource methods *************************/
    addOrUpdateResource(resourceParams: ResourceParamType, updateLocal?: boolean): Promise<Nullable<ResourceInfo>>;
    removeResource(id: string): void;
    getResource(id:string): Nullable<ResourceInfo>;
    /*********** end resource methods *************************/

    /*********** begin excerpt methods *************************/
    addOrUpdateExcerpt(excerptParams: ExcerptParamType, updateLocal?: boolean): Promise<Nullable<ExcerptInfo>>;
    removeExcerpt(id: string): void;
    getExcerpt(id:string): Nullable<ExcerptInfo>;
    /*********** end excerpt methods *************************/


    /*********** begin note methods *************************/
    addOrUpdateNote(noteParam: NoteParamType, updateLocal?: boolean): Promise<Nullable<NoteInfo>>;
    removeNote(id: string): void;
    getNote(id:string): Nullable<NoteInfo>;
    /*********** end note methods *************************/



    /*********** begin multi-part methods *************************/

    addNoteToExcerpt(noteParams: NoteParamType, excerptParams: ExcerptParamType, resourceParams: ResourceParamType, pocketParams: PocketParamType): void;
    //
    // addNoteToReport(noteParams: NoteParamType, reportDocumentParams: ResourceParamType): void;
    //
    // addExcerptToReportDocument(excerptParams: ExcerptParamType, reportDocumentParams: ResourceParamType): void;
    //
    // addReportToPocket(reportParams: ReportParamType, pocketParams: PocketParamType): void;

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
export type ResourceParamType = Omit<Partial<ResourceInfo>, OmitParamsType>;
export type ReportParamType = Omit<Partial<ReportInfo>, OmitParamsType>;
export type PocketParamType = Omit<Partial<PocketInfo>, OmitParamsType>;
