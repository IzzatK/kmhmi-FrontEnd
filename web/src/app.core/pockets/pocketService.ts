import {createSelector, OutputSelector} from "@reduxjs/toolkit";
import {forEach, forEachKVP} from "../../framework.visual/extras/utils/collectionUtils";
import {DocumentInfo, MetadataInfo, MetadataType, ParamType, SearchParamInfo, SortPropertyInfo} from "../../app.model";
import {Nullable} from "../../framework.core/extras/typeUtils";

import {IDocumentService, IEntityProvider, IUserService} from "../../app.core.api";
import {Plugin} from "../../framework.core/extras/plugin";
import {RepoItem} from "../../framework.core/services/repoService/repoItem";
import {IPocketService} from "../../app.core.api";
import {PocketInfo} from "../../app.model";

export class PocketService extends Plugin implements IPocketService {
    public static readonly class:string = 'DocumentService';
    private userService: Nullable<IUserService> = null;
    private pocketProvider?: Nullable<IEntityProvider<RepoItem>> = null;



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

    setUserService(userService: IUserService) {
        this.userService = userService;
    }

    createPocket(pocket: PocketInfo): void {
    }

    deletePocket(id: string): void {
    }

    fetchPocket(id: string): void {
    }

    fetchPockets(): void {
    }

    getPocket(id: string): Nullable<PocketInfo> {
        return null;
    }

    getPockets(id: string): Record<string, PocketInfo> {
        return {};
    }

    setPocketProvider(provider: IEntityProvider<PocketInfo>): void {
    }

    updatePocket(modifiedPocket: Record<string, any>): void {
    }

}
