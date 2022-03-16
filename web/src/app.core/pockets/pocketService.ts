import {Nullable} from "../../framework.core/extras/utils/typeUtils";
import {
    ExcerptParamType,
    IDocumentService,
    IPocketService,
    IUserService,
    NoteParamType,
    ResourceParamType
} from "../../app.core.api";
import {Plugin} from "../../framework.core/extras/plugin";
import {
    DocumentInfo,
    ExcerptInfo,
    ExcerptMapper,
    NoteInfo,
    PocketInfo,
    PocketMapper,
    ReportMapper,
    ResourceInfo,
    ResourceMapper
} from "../../app.model";
import {IEntityProvider, ISelectionService} from "../../framework.core.api";
import {forEach} from "../../framework.core/extras/utils/collectionUtils";
import {IRepoItem} from "../../framework.core/services";
import {createSelector, OutputSelector} from "@reduxjs/toolkit";


type GetAllPocketMapperSelector = OutputSelector<any, Record<string, PocketMapper>,
    (res1: Record<string, PocketInfo>,
     res3: Record<string, ResourceInfo>,
     res5: Record<string, ExcerptInfo>,
     res4: Record<string, NoteInfo>)
        => (Record<string, PocketMapper>)>;

export class PocketService extends Plugin implements IPocketService {

    public static readonly class:string = 'DocumentService';

    private userService: Nullable<IUserService> = null;
    private selectionService: Nullable<ISelectionService> = null;
    private documentService: Nullable<IDocumentService> = null;

    private pocketProvider: Nullable<IEntityProvider<PocketMapper>> = null;
    private excerptProvider: Nullable<IEntityProvider<ExcerptInfo>> = null;
    private noteProvider: Nullable<IEntityProvider<NoteInfo>> = null;
    private resourceProvider: Nullable<IEntityProvider<ResourceInfo>> = null;

    private documentProvider?: Nullable<IEntityProvider<DocumentInfo>> = null;

    private readonly getAllPocketMapperSelector: GetAllPocketMapperSelector;

    constructor() {
        super();
        this.appendClassName(PocketService.class);

        this.getAllPocketMapperSelector = createSelector(
            [
                (s) => this.getAll<PocketInfo>(PocketInfo.class),
                (s) => this.getAll<ResourceInfo>(ResourceInfo.class),
                (s) => this.getAll<ExcerptInfo>(ExcerptInfo.class),
                (s) => this.getAll<NoteInfo>(NoteInfo.class),
            ],
            (pockets, resources, excerpts, notes) => {

                const pocketMappers: Record<string, PocketMapper> = {};

                debugger
                forEach(pockets, (pocketInfo: PocketInfo) => {
                    const pocketMapper = new PocketMapper(pocketInfo);

                    forEach(pocketInfo.resource_ids, (resourceId: string) => {
                        const resource: ResourceInfo = resources[resourceId];
                        const resourceMapper = new ResourceMapper(resource);

                        forEach(resource.excerptIds, (excerptId: string) => {
                            const excerpt: ExcerptInfo = excerpts[excerptId];
                            const excerptMapper = new ExcerptMapper(excerpt);

                            forEach(excerpt.noteIds, (noteId: string) => {
                                excerptMapper.notes[noteId] = notes[noteId];
                            });

                            resourceMapper.excerptMappers[excerptId] = excerptMapper;
                        });

                        pocketMapper.resourceMappers[resourceId] = resourceMapper;

                    });

                    pocketMappers[pocketInfo.id] = pocketMapper;
                });

                return pocketMappers;
            }
        )
    }

    getReportMapper(reportId: string): Nullable<ReportMapper> {
        throw new Error("Method not implemented.");
    }

    // private makeGetSingleExcerptMapperSelector(id: string): GetExcerptMapperSelector {
    //     return createSelector(
    //         [
    //             () => this.getRepoItem<ReportDocumentInfo>(ReportDocumentInfo.class, id),
    //             () => this.getAll<ExcerptInfo>(ExcerptInfo.class),
    //             () => this.getAll<NoteInfo>(NoteInfo.class)
    //         ],
    //         (reportDocumentInfo, excerpts, notes) => {
    //
    //             const mappers: Record<string, ExcerptMapper> = {};
    //
    //             let documentInfo: Nullable<ReportDocumentInfo> = reportDocumentInfo;
    //
    //             if (documentInfo == null) {
    //                 return mappers;
    //             }
    //
    //             forEach(documentInfo.excerptIds, (excerptId: string) => {
    //
    //                 let excerpt = this.getRepoItem<ExcerptInfo>(ExcerptInfo.class, excerptId);
    //
    //                 const mapperNotes:Record<string, NoteInfo> = {};
    //
    //                 if (excerpt != null) {
    //                     forEach(excerpt.noteIds, (noteId: string) => {
    //                         let note = notes[noteId];
    //                         if (note != null) {
    //                             mapperNotes[noteId] = note;
    //                         }
    //                     })
    //
    //                     mappers[excerptId] = new ExcerptMapper(excerpt, mapperNotes);
    //                 }
    //             });
    //
    //             return mappers;
    //         }
    //     )
    // }

    private getFilteredRecords<T extends IRepoItem>(ids: string[], lookup: Record<string, T>): Record<string, T> {
        const filteredRecords: Record<string, T> = {};

        forEach(ids, (id: string) => {

            let result: Nullable<T> = null;
            if (lookup[id]) {
                result = lookup[id];
            }

            if (result != null) {
                filteredRecords[id] = lookup[id];
            }
            else {
                this.warn(`When building report for ${id}, metadata with id ${id} was not found`);
            }
        });

        return filteredRecords;
    }

    start() {
        super.start();
    }

    stop() {
        super.stop();
    }

    configure() {
        super.configure();
    }

    setUserService(service: IUserService): void {
        this.userService = service;
    }

    setSelectionService(service: ISelectionService) {
        this.selectionService = service;
    }

    setDocumentService(service: IDocumentService): void {
        this.documentService = service
    }

    setPocketProvider(provider: IEntityProvider<PocketMapper>): void {
        this.pocketProvider = provider
    }

    setResourceProvider(provider: IEntityProvider<ResourceInfo>): void {
        this.resourceProvider = provider;
    }

    setExcerptProvider(provider: IEntityProvider<ExcerptInfo>): void {
        this.excerptProvider = provider;
    }

    setNoteProvider(provider: IEntityProvider<NoteInfo>): void {
        this.noteProvider = provider;
    }

    getPocketInfos(): Record<string, PocketInfo> {
        return this.getAll(PocketInfo.class);
    }

    getPocketInfo(id: string): Nullable<PocketInfo> {
        let result: Nullable<PocketInfo> = null;

        if (this.pocketProvider != null) {
            result = this.getRepoItem(PocketInfo.class, id);
        }

        return result;
    }

    getPocketMappers(): Record<string, PocketMapper> {
        return this.getAllPocketMapperSelector(this.getRepoState());
    }

    getPocketMapper(id: string): Nullable<PocketMapper> {
        const pocketMappers = this.getAllPocketMapperSelector(this.getRepoState());

        let result: Nullable<PocketMapper> = null;

        if (pocketMappers[id] != null) {
            result = pocketMappers[id];
        }

        return result;
    }

    createPocket(title: string): void {
        this.pocketProvider?.create(title)
            .then((pocketMapper: Nullable<PocketMapper>) => {
                if (pocketMapper != null) {
                    const items = this.flattenPocketMapper(pocketMapper);
                    this.addOrUpdateAllRepoItems(items);
                }
            })
    }

    deletePocket(id: string): void {
        this.pocketProvider?.remove(id)
            .then((pocketMapper: Nullable<PocketMapper>) => {
                if (pocketMapper != null) {
                    const items = this.flattenPocketMapper(pocketMapper);
                    this.removeRepoItems(items);
                }
            })
    }

    fetchPocket(id: string): void {
        this.pocketProvider?.getSingle(id)
            .then((pocketMapper: Nullable<PocketMapper>) => {
                // get the items out of pocketMapper
                if (pocketMapper != null) {
                    const items = this.flattenPocketMapper(pocketMapper);
                    this.addOrUpdateAllRepoItems(items);
                }
            });
    }

    fetchPockets(): void {
        this.pocketProvider?.getAll()
            .then((pocketMappers: PocketMapper[]) => {
                // get the items out of pocketMapper
                const items:IRepoItem[] = [];

                forEach(pocketMappers, (pocketMapper: PocketMapper) => {
                    const flattenedItems = this.flattenPocketMapper(pocketMapper);
                    items.push(...flattenedItems);
                })

                this.addOrUpdateAllRepoItems(items);
            });
    }

    updatePocket(id: string, pocketMapper: PocketMapper): void {
        this.pocketProvider?.update(id, pocketMapper)
            .then((pocketMapper: Nullable<PocketMapper>) => {
                if (pocketMapper != null) {
                    this.addOrUpdateAllRepoItems(this.flattenPocketMapper(pocketMapper));
                }
            })
    }

    private flattenPocketMapper(pocketMapper: PocketMapper) {
        const result = [];

        result.push(pocketMapper.pocket);

        forEach(pocketMapper.resourceMappers, (resourceMapper: ResourceMapper) => {
            result.push(resourceMapper.resource);

            forEach(resourceMapper.excerptMappers, (excerptMapper: ExcerptMapper) => {
                result.push(excerptMapper.excerpt);

                forEach(excerptMapper.notes, (note: NoteInfo) => {
                    result.push(note);
                });
            });
        });

        return result;
    }

    addOrUpdateExcerpt(excerptParamType: ExcerptParamType): Promise<Nullable<ExcerptInfo>> {
        return this.addOrUpdateRemoteItem(ExcerptInfo.class, this.excerptProvider, excerptParamType, false);
    }

    removeExcerpt(id: string) {
        return this.deleteRemoteItem(ExcerptInfo.class, id, this.excerptProvider);
    }

    getExcerpt(id: string): Nullable<ExcerptInfo> {
        return this.getRepoItem(ExcerptInfo.class, id);
    }

    addOrUpdateNote(noteParam: NoteParamType): Promise<Nullable<NoteInfo>> {
        return this.addOrUpdateRemoteItem(NoteInfo.class, this.noteProvider, noteParam, false);
    }

    removeNote(id: string): Promise<Nullable<NoteInfo>> {
        return this.deleteRemoteItem<NoteInfo>(NoteInfo.class, id, this.noteProvider, );
    }

    getNote(id: string): Nullable<NoteInfo> {
        return this.getRepoItem(NoteInfo.class, id);
    }

    addOrUpdateResource(resourceParamType: ResourceParamType): Promise<Nullable<ResourceInfo>> {
        return this.addOrUpdateRemoteItem(ResourceInfo.class, this.resourceProvider, resourceParamType, false);
    }

    removeResource(id: string) {
        return this.deleteRemoteItem(ResourceInfo.class, id, this.resourceProvider);
    }

    getResource(id: string): Nullable<ResourceInfo> {
        return this.getRepoItem(ResourceInfo.class, id);
    }
}
