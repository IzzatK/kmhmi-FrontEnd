import {Nullable} from "../../framework.core/extras/typeUtils";
import {IEntityProvider, IPocketService, IUserService} from "../../app.core.api";
import {Plugin} from "../../framework.core/extras/plugin";
import {
    ExcerptInfo,
    NoteInfo,
    PocketInfo,
    ReportDocumentInfo,
    ReportInfo,
} from "../../app.model";
import {ISelectionService} from "../../framework.api";
import {PocketMapper} from "../../app.model";
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

export class PocketService extends Plugin implements IPocketService {
    public static readonly class:string = 'DocumentService';

    private userService: Nullable<IUserService> = null;
    private selectionService: Nullable<ISelectionService> = null;

    private pocketProvider?: Nullable<IEntityProvider<PocketMapper>> = null;

    private readonly getAllPocketMapperSelector: GetAllPocketMapperSelector;

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

    addOrUpdateExcerpt(pocketId: string, documentId: string, excerpt: string, note: string, reportId?: string): void {
    }

    updateReport(modifiedReport: Record<string, any>): void {
    }
}
