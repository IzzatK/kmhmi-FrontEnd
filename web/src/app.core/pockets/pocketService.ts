import {KeyValuePair, Nullable} from "../../framework.core/extras/typeUtils";
import {IDocumentService, IEntityProvider, IPocketService, IUserService} from "../../app.core.api";
import {Plugin} from "../../framework.core/extras/plugin";
import {
    DocumentInfo,
    ExcerptInfo,
    ExcerptMapper,
    NoteInfo,
    PocketInfo,
    PocketMapper,
    ReportDocumentInfo,
    ReportInfo,
    ReportMapper,
    ReportDocumentMapper
} from "../../app.model";
import {ISelectionService} from "../../framework.api";
import {forEach} from "../../framework.visual/extras/utils/collectionUtils";
import {IRepoItem} from "../../framework.core/services/repoService/repoItem";
import {createSelector, OutputSelector} from "@reduxjs/toolkit";


type GetAllPocketMapperSelector = OutputSelector<any, Record<string, PocketMapper>,
    (res1: Record<string, PocketInfo>,
     res2: Record<string, ReportInfo>,
     res3: Record<string, ReportDocumentInfo>,
     res4: Record<string, NoteInfo>,
     res5: Record<string, ExcerptInfo>)
        => (Record<string, PocketMapper>)>;

// type GetExcerptMapperSelector = OutputSelector<any, Record<string, ExcerptMapper>,
//     (res2: ReportDocumentInfo,
//      res3: Record<string, ExcerptInfo>,
//      res4: Record<string, NoteInfo>)
//         => Record<string, ExcerptMapper>>;

type createExcerptReturnArgs = {
    report: ReportInfo
    reportDocument: ReportDocumentInfo,
    excerpt: ExcerptInfo
}

export class PocketService extends Plugin implements IPocketService {

    public static readonly class:string = 'DocumentService';

    private userService: Nullable<IUserService> = null;
    private selectionService: Nullable<ISelectionService> = null;
    private documentService: Nullable<IDocumentService> = null;

    private pocketProvider?: Nullable<IEntityProvider<PocketMapper>> = null;
    private excerptProvider?: Nullable<IEntityProvider<ExcerptInfo>> = null;
    private noteProvider?: Nullable<IEntityProvider<NoteInfo>> = null;
    private documentProvider?: Nullable<IEntityProvider<DocumentInfo>> = null;

    private readonly getAllPocketMapperSelector: GetAllPocketMapperSelector;

    // private excerptMapperSelectorPair: Nullable<KeyValuePair<string, GetExcerptMapperSelector>> = null;
    // private getSingleExcerptMapperSelector: Nullable<GetExcerptMapperSelector> = null;

    constructor() {
        super();
        this.appendClassName(PocketService.class);

        this.getAllPocketMapperSelector = createSelector(
            [
                () => this.getAll<PocketInfo>(PocketInfo.class),
                () => this.getAll<ReportInfo>(ReportInfo.class),
                () => this.getAll<ReportDocumentInfo>(ReportDocumentInfo.class),
                () => this.getAll<NoteInfo>(NoteInfo.class),
                () => this.getAll<ExcerptInfo>(ExcerptInfo.class)
            ],
            (pockets, reports, reportDocumentInfos, notes, excerpts) => {

                const pocketMappers: Record<string, PocketMapper> = {};

                forEach(pockets, (pocketInfo: PocketInfo) => {

                    const tmpReportMappers: Record<string, ReportMapper> = {};

                    forEach(pocketInfo.report_ids, (reportId: string) => {

                        const report: ReportInfo = reports[reportId];
                        const tmpReportDocumentMappers: Record<string, ReportDocumentMapper> = {};

                        forEach(report.document_ids, (reportDocumentId: string) => {

                            const document:ReportDocumentInfo = reportDocumentInfos[reportDocumentId];
                            const tmpExcerptMappers: Record<string, ExcerptMapper> = {};

                            forEach(document.excerptIds, (excerptId: string) => {

                                const excerpt: ExcerptInfo = excerpts[excerptId];
                                const tmpNotes: Record<string, NoteInfo> = {};

                                forEach(excerpt.noteIds, (noteId: string) => {
                                    tmpNotes[noteId] = tmpNotes[noteId];
                                });

                                tmpExcerptMappers[excerptId] = new ExcerptMapper(excerpt, notes);
                            });

                            tmpReportDocumentMappers[reportDocumentId] = new ReportDocumentMapper(document, tmpExcerptMappers);

                        })

                        tmpReportMappers[reportId] = new ReportMapper(report, tmpReportDocumentMappers);
                    });

                    pocketMappers[pocketInfo.id] = new PocketMapper(pocketInfo, tmpReportMappers);
                });

                return pocketMappers;
            }
        )
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

    private getFilteredRecords<T extends IRepoItem>(ids: Set<string>, lookup: Record<string, T>): Record<string, T> {
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

        forEach(pocketMapper.reportMappers, (reportMapper: ReportMapper) => {
           result.push(reportMapper.report);

           forEach(reportMapper.reportDocumentMappers, (reportDocumentMapper: ReportDocumentMapper) => {
               result.push(reportDocumentMapper.document);

               forEach(reportDocumentMapper.excerptMappers, (excerptMapper: ExcerptMapper) => {
                   result.push(excerptMapper.excerpt);

                   forEach(excerptMapper.notes, (note: NoteInfo) => {
                       result.push(note);
                   })

               })

           })
        });

        return result;
    }

    addOrUpdateExcerpt(reportId: string, documentId: string, excerpt: string, note: string): void {
    }

    // getExcerptMappers(documentId: string): Nullable<Record<string, ExcerptMapper>> {
    //     if (this.excerptMapperSelectorPair == null ||
    //         this.excerptMapperSelectorPair.key != documentId) {
    //
    //         const selector: GetExcerptMapperSelector = this.makeGetSingleExcerptMapperSelector(documentId);
    //
    //         this.excerptMapperSelectorPair = {
    //             key: documentId,
    //             value: selector
    //         };
    //     }
    //
    //     return this.excerptMapperSelectorPair.value(this.getRepoState());
    // }

    getExcerpt(id: string): Nullable<ExcerptInfo> {
        return this.getRepoItem(ExcerptInfo.class, id);
    }

    createExcerpt(excerptText: string, reportId: string, documentId: string, text: string, location: string): Promise<createExcerptReturnArgs> {
        const me = this;

        return new Promise<createExcerptReturnArgs>((resolve, reject) => {
            this.excerptProvider?.create({excerptText, location})
                .then(excerpt => {

                    const report = me.getRepoItem<ReportInfo>(ReportInfo.class, reportId);

                    if (excerpt == null) {
                        reject('Unable to create excerpt on the server')
                    }
                    else if (report == null) {
                        reject(`Report with id ${reportId} does not exist`);
                    }

                    else {

                        let reportDocument = this.getRepoItem<ReportDocumentInfo>(ReportDocumentInfo.class, documentId);

                        // if the report does not contain the document id or if it is null, then set it up
                        if (reportDocument == null || !report.document_ids.includes(documentId)) {
                            let docInfo = this.getRepoItem<DocumentInfo>(DocumentInfo.class, documentId);

                            // create the report document from the search document
                            if (docInfo != null) {
                                reportDocument = new ReportDocumentInfo(docInfo.id);
                                reportDocument.title = docInfo.title;
                                reportDocument.author_id = docInfo.author;
                                reportDocument.publication_date = docInfo.publication_date;
                                if (!reportDocument.excerptIds.includes(excerpt.id)) {
                                    reportDocument.excerptIds.push(excerpt.id);
                                }
                            }

                            // add the report id to the report
                            if (reportDocument != null) {
                                if (!report.document_ids.includes(reportDocument.id)) {
                                    report.document_ids.push(reportDocument.id);
                                }
                            }
                        }

                        if (reportDocument == null) {
                            reject(`Could not find document with id - ${documentId}`);
                        }
                        else {
                            resolve({report, reportDocument: reportDocument, excerpt});
                        }
                    }
                })
        });
    }


    /***
     * @param text - note text
     * @param reportId - id of the report chosen by the user
     * @param documentId - document currently visible to the user
     * @param excerptText - highlighted text in the document
     * @param location - location of text in the document
     */
    createNoteWithoutExcerpt(text: string, reportId: string, documentId: string, excerptText: string, location: string): void {
        this.createExcerpt(text, reportId, documentId, excerptText, location)
            .then(data => {
                const report = data.report;
                const reportDocument = data.reportDocument;
                const excerpt = data.excerpt;

                this.noteProvider?.create(text)
                    .then(note => {
                        if (note != null) {
                            if (!excerpt.noteIds.includes(note.id)) {
                                excerpt.noteIds.push(note.id);
                            }

                            this.addOrUpdateAllRepoItems([report, reportDocument, excerpt, note]);

                            // now find the pocket and send the update
                            let pocketInfos = this.getAll<PocketInfo>(PocketInfo.class);
                            forEach(pocketInfos, (pocket: PocketInfo) => {
                                if (pocket.report_ids.includes(report.id)) {
                                    let pocketMapper = this.getPocketMapper(pocket.id);
                                    if (pocketMapper != null) {
                                        this.updatePocket(pocket.id, pocketMapper);
                                    }
                                    return true;
                                }
                            });
                        }
                        else {
                            this.error(`Error when creating note with text "${text}"`);
                        }
                    })
                    .catch(error => {
                        this.error(error);
                    })

            })
            .catch(error => {
                this.error(error);
            })
    }

    findReportDocumentByPock(id: string) : Nullable<ReportDocumentInfo>{
        return null;
    }

    findReportDocumentById(id: string) : Nullable<ReportDocumentInfo>{
        return null;
    }

    // private createNoteWithExcerpt(text: string, reportId: string, excerptId: string) {
    //     const excerpt = this.getRepoItem<ExcerptInfo>(ExcerptInfo.class, excerptId);
    //     const report = this.getRepoItem<ReportInfo>(ReportInfo.class, reportId);
    //
    //     this.noteProvider?.create({text})
    //         .then(note => {
    //             if (note != null && excerpt != null) {
    //
    //                 excerpt.noteIds.add(note.id);
    //
    //                 // this will update the excerpt mapper;
    //                 this.addOrUpdateAllRepoItems([excerpt, note]);
    //
    //                 let pocketId = report?.pocket_id;
    //                 if (pocketId != null) {
    //                     let pocketMapper = this.getPocketMapper(pocketId);
    //
    //                     // pocket mapper should re-calcuate automatically
    //                     this.pocketProvider?.update(pocketId, pocketMapper);
    //                 }
    //             }
    //             else {
    //                 this.error(`Error when attempting to note attached to excerpt with id - ${excerptId}`);
    //             }
    //         })
    // }

    deleteExcerpt(id: string): void {

    }

    deleteNote(id: string): void {

    }

    updateNote(): void {
    }

    updateReport(id: string, modifiedReport: Record<string, any>): void {

    }

    getReportMapper(reportId: string): Nullable<ReportMapper> {
        throw new Error("Method not implemented.");
    }

    getExcerptMappers(documentId: string): Nullable<Record<string, ExcerptMapper>> {
        throw new Error("Method not implemented.");
    }
}
