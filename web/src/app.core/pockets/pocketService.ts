import {Nullable} from "../../framework.core/extras/typeUtils";

import {IEntityProvider, IUserService} from "../../app.core.api";
import {Plugin} from "../../framework.core/extras/plugin";
import {IPocketService} from "../../app.core.api";
import {PocketInfo} from "../../app.model";
import {ISelectionService} from "../../framework.api";
import {IWocketInfo} from "../../app.model/pockets/wocketInfo";

export class PocketService extends Plugin implements IPocketService {
    public static readonly class:string = 'DocumentService';

    private userService: Nullable<IUserService> = null;
    private selectionService: Nullable<ISelectionService> = null;

    private pocketProvider?: Nullable<IEntityProvider<IWocketInfo>> = null;

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

    createPocket(pocket: PocketInfo): void {
    }

    deletePocket(id: string): void {
    }

    fetchPocket(id: string): void {
        this.pocketProvider?.getSingle(id)
            .then((wockets: IWocketInfo[]) => {
                this.addOrUpdateAllRepoItems(wockets);
            })
    }

    fetchPockets(): void {

        this.pocketProvider?.getAll()
            .then((wockets: IWocketInfo[]) => {
                this.addOrUpdateAllRepoItems(wockets);
            })
    }

    getPocketItems(id: string): IWocketInfo[] {
        return [];
    }

    getAllPocketItems(): IWocketInfo[] {
        return [];
    }

    setPocketProvider(provider: IEntityProvider<IWocketInfo>): void {
        this.pocketProvider = provider;
    }

    updatePocket(modifiedPocket: Record<string, any>): void {
    }

}
