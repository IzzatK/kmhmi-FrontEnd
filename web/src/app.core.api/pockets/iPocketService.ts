import {Nullable} from "../../framework.core/extras/typeUtils";
import {IPlugin} from "../../framework.api";
import {IUserService} from "../users/iUserService";
import {IEntityProvider} from "../common/iEntityProvider";
import {PocketInfo} from "../../app.model";

export interface IPocketService extends IPlugin {

    createPocket(pocket: PocketInfo) : void;

    fetchPocket(id: string): void;

    fetchPockets(): void;

    updatePocket(modifiedPocket: Record<string, any>): void;

    deletePocket(id: string): void;


    getPocket(id: string): Nullable<PocketInfo>;

    getPockets(id: string): Record<string, PocketInfo>;

    setUserService(userService: IUserService): void;

    setPocketProvider(provider: IEntityProvider<PocketInfo>): void;
}
