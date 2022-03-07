import {IPlugin, ISelectionService} from "../../framework.api";
import {IUserService} from "../users/iUserService";
import {IEntityProvider} from "../common/iEntityProvider";
import {PocketInfo} from "../../app.model";
import {IWocketInfo} from "../../app.model/pockets/wocketInfo";

export interface IPocketService extends IPlugin {

    createPocket(pocket: PocketInfo) : void;

    fetchPocket(id: string): void;

    fetchPockets(): void;

    updatePocket(modifiedPocket: Record<string, any>): void;

    deletePocket(id: string): void;

    getPocketItems(id: string): IWocketInfo[];

    getAllPocketItems(): IWocketInfo[];

    setPocketProvider(provider: IEntityProvider<IWocketInfo>): void;

    setUserService(userService: IUserService): void;
    setSelectionService(service: ISelectionService): void;
}
