import {Nullable} from "../../framework.core/extras/utils/typeUtils";
import {
    ExcerptParamType,
    IDocumentService,
    IPocketService,
    IUserService,
    NoteParamType,
    PocketParamType,
    ResourceParamType,
} from "../../app.core.api";
import {Plugin} from "../../framework.core/extras/plugin";
import {
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
import {authenticationService} from "../../serviceComposition";


type GetAllPocketMapperSelector = OutputSelector<any, Record<string, PocketMapper>,
    (res1: Record<string, PocketInfo>,
     res2: Record<string, ResourceInfo>,
     res3: Record<string, ExcerptInfo>,
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

    private readonly getAllPocketMapperSelector: GetAllPocketMapperSelector;

    constructor() {
        super();
        this.appendClassName(PocketService.class);

        this.getAllPocketMapperSelector = createSelector(
            [
                (s) => this.getAll<PocketInfo>(PocketInfo.class),
                (s) => this.getAll<ResourceInfo>(ResourceInfo.class),
                (s) => this.getAll<ExcerptInfo>(ExcerptInfo.class),
                (s) => this.getAll<NoteInfo>(NoteInfo.class)
            ],
            (pockets, resources, excerpts, notes) => {
                const pocketMappers: Record<string, PocketMapper> = {};

                forEach(pockets, (pocketInfo: PocketInfo) => {
                    const pocketMapper = new PocketMapper(pocketInfo);

                    forEach(pocketInfo.resource_ids, (resourceId: string) => {

                        const resource: ResourceInfo = resources[resourceId];

                        if (resource == null) {
                            this.warn(`Pocket ${pocketInfo.id} refers to resource ${resourceId}, but resource ${resourceId} not found!`)
                        }
                        else {

                            const resourceMapper = new ResourceMapper(resource);

                            forEach(resource.excerptIds, (excerptId: string) => {
                                const excerpt: ExcerptInfo = excerpts[excerptId];

                                if (excerpt == null) {
                                    this.warn(`Resource ${resourceId} refers to excerpt ${excerptId}, but excerpt ${excerptId} not found!`)
                                }
                                else {

                                    const excerptMapper = new ExcerptMapper(excerpt);

                                    forEach(excerpt.noteIds, (noteId: string) => {
                                        const note: NoteInfo = notes[noteId];

                                        if (note == null) {
                                            this.warn(`Excerpt ${excerptId} refers to note ${noteId}, but note ${noteId} not found!`)
                                        }
                                        else {
                                            excerptMapper.notes[noteId] = notes[noteId];
                                        }
                                    });

                                    resourceMapper.excerptMappers[excerptId] = excerptMapper;
                                }
                            });

                            pocketMapper.resourceMappers[resourceId] = resourceMapper;
                        }
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

    addOrUpdatePocket(params: PocketParamType, updateLocal: boolean = true): Promise<Nullable<PocketMapper>> {
        return new Promise<PocketMapper>((resolve, reject) => {
                let shortClassName = 'PocketMapper'

                if (params.id != null) {
                    const existingItem = this.getPocketMapper(params.id);

                    if (existingItem != null) {

                        // check if params other than id exist on params
                        if (this.pocketProvider != null) {
                            this.pocketProvider.update(params.id, params)
                                .then(result => {
                                    if (result != null) {
                                        if (updateLocal) {
                                            const items = this.flattenPocketMapper(result);
                                            this.addOrUpdateAllRepoItems(items);
                                        }
                                        resolve(result);
                                    }
                                    else {
                                        throw 'Pocket provider provided null return value';
                                    }


                                })
                                .catch(error => {
                                    this.error(`Error while updating ${shortClassName} \n ${error}`);
                                    reject(existingItem);
                                })
                        }
                        else {
                            reject(existingItem);
                        }
                    }
                    else {
                        this.error(`Error while retrieving ${shortClassName}: ${shortClassName} id was supplied but does not exist locally`);
                    }
                }
                else {
                    if (this.pocketProvider == null) {
                        this.error(`${shortClassName} Provider is null!`);
                        reject(null);
                    }
                    else {
                        params.author_id = authenticationService.getUserId();
                        this.pocketProvider.create(params)
                            .then(result => {
                                if (result != null) {
                                    if (updateLocal) {
                                        const items = this.flattenPocketMapper(result);
                                        this.addOrUpdateAllRepoItems(items);
                                    }
                                    resolve(result);
                                }
                                else {
                                    throw 'Error while creating pocket!';
                                }
                            })
                            .catch(error => {
                                this.error(error + `\nError while creating ${shortClassName} with params ${JSON.stringify(params)}`);
                                reject(null);
                            });
                    }
                }
            }
        );
    }

    removePocket(id: string): void {
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

    addOrUpdateExcerpt(excerptParamType: ExcerptParamType, updateLocal: boolean = true): Promise<Nullable<ExcerptInfo>> {
        return this.addOrUpdateRemoteItem(ExcerptInfo.class, this.excerptProvider, excerptParamType, updateLocal);
    }

    removeExcerpt(id: string) {
        // TODO might want to remove any notes that referenced this excerpt
        return this.deleteRemoteItem(ExcerptInfo.class, id, this.excerptProvider);
    }

    getExcerpt(id: string): Nullable<ExcerptInfo> {
        return this.getRepoItem(ExcerptInfo.class, id);
    }

    addOrUpdateNote(noteParam: NoteParamType, updateLocal: boolean = true): Promise<Nullable<NoteInfo>> {
        return this.addOrUpdateRemoteItem(NoteInfo.class, this.noteProvider, noteParam, updateLocal);
    }

    removeNote(id: string): Promise<Nullable<NoteInfo>> {
        // TODO might want to remove any pockets/resources that referenced this note
        return this.deleteRemoteItem<NoteInfo>(NoteInfo.class, id, this.noteProvider, );
    }

    getNote(id: string): Nullable<NoteInfo> {
        return this.getRepoItem(NoteInfo.class, id);
    }

    addOrUpdateResource(resourceParamType: ResourceParamType, updateLocal: boolean = true): Promise<Nullable<ResourceInfo>> {
        return this.addOrUpdateRemoteItem(ResourceInfo.class, this.resourceProvider, resourceParamType, updateLocal);
    }

    removeResource(id: string) {
        // TODO might want to remove any excerpts that referenced this resource
        this.deleteRemoteItem(ResourceInfo.class, id, this.resourceProvider, false)
            .then(resource => {
                if (resource != null) {
                    forEach(this.getPocketMappers(), (pocketMapper: PocketMapper) => {
                        if (pocketMapper.resourceMappers[id] != null) {
                            const pocket = pocketMapper.pocket;
                            const resourceIds:string[] = [];
                            forEach(pocket.resource_ids, (resourceId: string) => {
                                if (resourceId !== id) {
                                    resourceIds.push(resourceId);
                                }
                            })
                            pocket.resource_ids = resourceIds;
                            this.removeRepoItem(resource)
                            void this.addOrUpdatePocket(pocket);

                            return true;
                        }
                    })
                }
            })
    }

    getResource(id: string): Nullable<ResourceInfo> {
        return this.getRepoItem(ResourceInfo.class, id);
    }

    addNoteToExcerpt(noteParams: NoteParamType, excerptParams: ExcerptParamType, resourceParams: ResourceParamType, pocketParams: PocketParamType): void {

        const authorId = this.userService?.getCurrentUserId();

        if (!noteParams.id) {
            noteParams.author_id = authorId || '';
        }

        if (!excerptParams.id) {
            excerptParams.authorId = authorId || '';
        }

        if (!resourceParams.id) {
            resourceParams.author_id = authorId || '';
        }

        if (resourceParams.source_id) {
            if (this.documentService) {
                const document = this.documentService.getDocument(resourceParams.source_id);
                if (document != null) {
                    resourceParams.source_title = document.title || document.file_name || '---';
                    resourceParams.source_author = document.author || '---';
                    resourceParams.source_publication_date = document.publication_date || '---';
                    resourceParams.source_version = '---';
                }
            }
        }

        if (!pocketParams.id) {
            pocketParams.author_id = authorId || '';
        }

        let resourceSupplier = () => this.addOrUpdateResource(resourceParams, false);

        if (pocketParams.id) {
            let pocketMapper = this.getPocketMapper(pocketParams.id);

            if (pocketMapper != null) {
                // check if the source is already included in a resource for this pocket
                forEach(pocketMapper.resourceMappers, (resourceMapper: ResourceMapper) => {
                    if (resourceMapper.resource.source_id == resourceParams.source_id) {
                        resourceSupplier = () => new Promise<Nullable<ResourceInfo>>((resolve, reject) => {
                            resolve(resourceMapper.resource);
                        });
                        return true;
                    }
                })
            }
        }

        Promise.all([
            this.addOrUpdateNote(noteParams, false),
            this.addOrUpdateExcerpt(excerptParams, false),
            resourceSupplier(),
            this.addOrUpdatePocket(pocketParams, false)]
        )
            .then((values) => {
                const note: Nullable<NoteInfo> = values[0];
                const excerpt: Nullable<ExcerptInfo> = values[1];
                const resource: Nullable<ResourceInfo> = values[2];
                const pocketMapper: Nullable<PocketMapper> = values[3];

                if (note == null || excerpt == null || resource == null) {
                    throw new Error('Cannot create excerpt due to null return value')
                }
                else {
                    const updateItems: IRepoItem[] = [];

                    if (!resource.excerptIds.includes(excerpt.id)) {
                        resource.excerptIds.push(excerpt.id);

                        updateItems.push(resource);
                    }

                    if (!excerpt.noteIds.includes(note.id)) {
                        excerpt.noteIds.push(note.id);
                        updateItems.push(excerpt);
                    }

                    updateItems.push(note);

                    const pocketInfo = pocketMapper?.pocket;
                    if (pocketInfo != null && !pocketInfo.resource_ids.includes(resource.id)) {
                        pocketInfo.resource_ids.push(resource.id)
                        updateItems.push(pocketInfo);
                    }

                    this.addOrUpdateAllRepoItems(updateItems);
                }

            })
            .catch(error => {

            })
    }
}
