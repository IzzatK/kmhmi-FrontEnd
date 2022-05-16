import {IPlugin, ISelectionService, IEntityProvider} from "../../framework.core.api";
import {Nullable} from "../../framework.core/extras/utils/typeUtils";
import {
    ExcerptInfo,
    NoteInfo,
    PocketInfo,
    PocketMapper,
    ResourceInfo
} from "../../app.model";
import {IUserService} from "../users/iUserService";
import {IDocumentService} from "../documents/iDocumentService";
import {IReportService} from "../reports/iReportService";

export interface IPocketService extends IPlugin {
    /********** begin dependency injection **************************/
    setPocketProvider(provider: IEntityProvider<PocketMapper>): void;
    setResourceProvider(provider: IEntityProvider<ResourceInfo>): void;
    setExcerptProvider(provider:IEntityProvider<ExcerptInfo>): void;
    setNoteProvider(provider:IEntityProvider<NoteInfo>): void;

    setUserService(userService: IUserService): void;
    setSelectionService(service: ISelectionService): void;
    setDocumentService(service: IDocumentService): void;
    setReportService(service: IReportService): void;
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
    addNoteAndExcerptToPocket(noteParams: NoteParamType, excerptParams: ExcerptParamType, resourceParams: ResourceParamType, pocketParams: PocketParamType): void;
    addExcerptToPocket(excerptParams: ExcerptParamType, resourceParams: ResourceParamType, pocketParams: PocketParamType): void;
    addResourceToPocket(resourceParams: ResourceParamType, pocketParams: PocketParamType): void;

    removeNoteFromExcerpt(note_id: string, pocket_id: string): void;
    removeExcerptFromResource(excerpt_id: string, pocket_id: string): void;
    removeResourceFromPocket(resource_id: string, pocket_id: string): void;
    /*********** end multi-part methods *************************/
}

type OmitParamsType = 'className';

export type ExcerptParamType = Omit<Partial<ExcerptInfo>, OmitParamsType>;
export type NoteParamType = Omit<Partial<NoteInfo>, OmitParamsType>;
export type ResourceParamType = Omit<Partial<ResourceInfo>, OmitParamsType>;
export type PocketParamType = Omit<Partial<PocketInfo>, OmitParamsType>;
