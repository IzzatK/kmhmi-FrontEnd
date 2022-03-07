import {Nullable} from "../../framework.core/extras/typeUtils";

import {IEntityProvider, IPocketService, IUserService} from "../../app.core.api";
import {Plugin} from "../../framework.core/extras/plugin";
import {PocketInfo} from "../../app.model";
import {ISelectionService} from "../../framework.api";
import {PocketMapper} from "../../app.model/pockets/pocketMapper";
import {forEach} from "../../framework.visual/extras/utils/collectionUtils";
import {IRepoItem} from "../../framework.core/services/repoService/repoItem";

export class PocketService extends Plugin implements IPocketService {
    public static readonly class:string = 'DocumentService';

    private userService: Nullable<IUserService> = null;
    private selectionService: Nullable<ISelectionService> = null;

    private pocketProvider?: Nullable<IEntityProvider<PocketMapper>> = null;

    constructor() {
        super();
        this.appendClassName(PocketService.class);
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

    getPocketInfo(id: string): Nullable<PocketInfo> {
        let result: Nullable<PocketInfo> = null;

        if (this.pocketProvider != null) {
            result = this.getRepoItem(PocketInfo.class, id);
        }

        return result;
    }

    getPocketMapper(id: string): Nullable<PocketMapper> {
        // need to build out as a selector. DO NOT STORE IN REPO
        // when any selector inputs change, this would re-calculate
        return null;
    }

    getPocketInfos(): Record<string, PocketInfo> {
        return this.getAll(PocketInfo.class);
    }

    getPocketMappers(): Record<string, PocketMapper> {
        // need to build out as a selector. DO NOT STORE IN REPO
        // when any selector inputs change, this would re-calculate
        return {};
    }

    createPocket(pocket: PocketInfo): void {
        this.pocketProvider?.create(pocket)
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
                    // TO DO implement
                    // update repo service to remove multiple items at once
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
