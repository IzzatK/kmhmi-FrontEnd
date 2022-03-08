import {KeyValuePair, Nullable} from "../../framework.core/extras/typeUtils";
import {IDocumentService, IEntityProvider, IPocketService, IUserService} from "../../app.core.api";
import {Plugin} from "../../framework.core/extras/plugin";
import {
    DocumentInfo,
    ExcerptInfo,
    NoteInfo,
    PocketInfo,
    PocketMapper,
    ReportDocumentInfo,
    ReportInfo,
} from "../../app.model";
import {ISelectionService} from "../../framework.api";
import {forEach} from "../../framework.visual/extras/utils/collectionUtils";
import {IRepoItem} from "../../framework.core/services/repoService/repoItem";
import {createSelector, OutputSelector} from "@reduxjs/toolkit";
import {ExcerptMapper} from "../../app.model/pockets/excerptMapper";


type GetAllPocketMapperSelector = OutputSelector<any, Record<string, PocketMapper>,
    (res1: Record<string, PocketInfo>,
     res2: Record<string, ReportInfo>,
     res3: Record<string, ReportDocumentInfo>,
     res4: Record<string, NoteInfo>,
     res5: Record<string, ExcerptInfo>)
        => (Record<string, PocketMapper>)>;

type GetExcerptMapperSelector = OutputSelector<any, Record<string, ExcerptMapper>,
    (res1: DocumentInfo, // try search document first
     res2: ReportDocumentInfo, // then try report document
     res3: Record<string, ExcerptInfo>,
     res4: Record<string, NoteInfo>)
        => Record<string, ExcerptMapper>>;

export class PocketService extends Plugin implements IPocketService {

    public static readonly class:string = 'DocumentService';

    private userService: Nullable<IUserService> = null;
    private selectionService: Nullable<ISelectionService> = null;
    private documentService: Nullable<IDocumentService> = null;

    private pocketProvider?: Nullable<IEntityProvider<PocketMapper>> = null;

    private readonly getAllPocketMapperSelector: GetAllPocketMapperSelector;

    private excerptMapperSelectorPair: Nullable<KeyValuePair<string, GetExcerptMapperSelector>> = null;
    private getSingleExcerptMapperSelector: Nullable<GetExcerptMapperSelector> = null;

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

                const docsByReport: Record<string, Record<string, ReportDocumentInfo>> = {};
                const excerptsByReport: Record<string, Record<string, ExcerptInfo>> = {};
                const notesByReport: Record<string, Record<string, NoteInfo>> = {};

                const me = this;

                forEach(reports, (report: ReportInfo) => {
                    const reportId = report.id;

                    docsByReport[reportId] = me.getFilteredRecords(report.documentIds, reportDocumentInfos);
                    excerptsByReport[reportId] = me.getFilteredRecords(report.excerptIds, excerpts);
                    notesByReport[reportId] = me.getFilteredRecords(report.noteIds, notes);
                });

                forEach(pockets, (pocket: PocketInfo) => {
                    const pocketId = pocket.id;

                    const report: Nullable<ReportInfo> = reports[pocket.reportId];

                    const docs = docsByReport[report.id];
                    const excerpts = excerptsByReport[report.id];
                    const notes = notesByReport[report.id];

                    pocketMappers[pocketId] = new PocketMapper(pocket, report, notes, excerpts, docs);
                });

                return pocketMappers;
            }
        )
    }

    private makeGetSingleExcerptMapperSelector(id: string): GetExcerptMapperSelector {
        return createSelector(
            [
                () => this.getRepoItem<DocumentInfo>(DocumentInfo.class, id),
                () => this.getRepoItem<ReportDocumentInfo>(ReportDocumentInfo.class, id),
                () => this.getAll<ExcerptInfo>(ExcerptInfo.class),
                () => this.getAll<NoteInfo>(NoteInfo.class)
            ],
            (reportDocumentInfo, searchDocumentInfo, excerpts, notes) => {

                const mappers: Record<string, ExcerptMapper> = {};

                let documentInfo: Nullable<IRepoItem> = reportDocumentInfo;

                if (documentInfo == null) {
                    documentInfo = searchDocumentInfo;
                }

                if (documentInfo == null) {
                    return mappers;
                }

                const documentId = documentInfo.id;
                forEach(excerpts, (excerpt: ExcerptInfo) => {
                    const excerptId = excerpt.id;

                    if (excerpt.documentId == documentId) {
                        const mapperNotes:Record<string, NoteInfo> = {};

                        forEach(excerpt.noteIds, (noteId: string) => {
                            let note = notes[noteId];
                            if (note != null) {
                                mapperNotes[noteId] = note;
                            }
                        })

                        mappers[excerptId] = new ExcerptMapper(excerpt, mapperNotes);
                    }
                });

                return mappers;
            }
        )
    }

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

    updatePocket(id: string, modifiedPocket: Record<string, any>): void {
        this.pocketProvider?.update(id, modifiedPocket)
            .then((pocketMapper: Nullable<PocketMapper>) => {
                if (pocketMapper != null) {
                    const items = this.flattenPocketMapper(pocketMapper);
                    this.addOrUpdateAllRepoItems(items);
                }
            })
    }

    flattenPocketMapper(pocketMapper: PocketMapper) {
        return [
            pocketMapper.pocket,
            pocketMapper.report,
            ...Object.values(pocketMapper.documents),
            ...Object.values(pocketMapper.excerpts),
            ...Object.values(pocketMapper.notes)
        ]
    }

    addOrUpdateExcerpt(reportId: string, documentId: string, excerpt: string, note: string): void {
    }

    getExcerptMappers(documentId: string): Nullable<Record<string, ExcerptMapper>> {
        if (this.excerptMapperSelectorPair == null ||
            this.excerptMapperSelectorPair.key != documentId) {

            const selector: GetExcerptMapperSelector = this.makeGetSingleExcerptMapperSelector(documentId);

            this.excerptMapperSelectorPair = {
                key: documentId,
                value: selector
            };
        }

        return this.excerptMapperSelectorPair.value(this.getRepoState());
    }

    getExcerpt(id: string): Nullable<ExcerptInfo> {
        return this.getRepoItem(ExcerptInfo.class, id);
    }

    createExcerpt(documentId: string, text: string, location: string): void {

    }

    createNote(excerptId: string, text: string): void {

    }

    deleteExcerpt(id: string): void {

    }

    deleteNote(id: string): void {

    }

    updateNote(): void {
    }

    updateReport(id: string, modifiedReport: Record<string, any>): void {

    }
}
