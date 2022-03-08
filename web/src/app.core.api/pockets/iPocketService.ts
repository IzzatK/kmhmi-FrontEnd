import {IPlugin, ISelectionService} from "../../framework.api";
import {IUserService} from "../users/iUserService";
import {IEntityProvider} from "../common/iEntityProvider";
import {PocketInfo} from "../../app.model";
import {Nullable} from "../../framework.core/extras/typeUtils";
import {PocketMapper} from "../../app.model";

export interface IPocketService extends IPlugin {
    // dependency injection
    setPocketProvider(provider: IEntityProvider<PocketMapper>): void;

    setUserService(userService: IUserService): void;
    setSelectionService(service: ISelectionService): void;

    // client methods
    getPocketInfos(): Record<string, PocketInfo>;
    getPocketInfo(id: string): Nullable<PocketInfo>;

    getPocketMappers(): Record<string, PocketMapper>;
    getPocketMapper(id: string): Nullable<PocketMapper>;

    // server methods
    createPocket(title: string) : void;

    fetchPocket(id: string): void;

    fetchPockets(): void;

    updatePocket(id: string, modifiedPocket: Record<string, any>): void;

    deletePocket(id: string): void;


    //Josiah's requests
    updateReport(modifiedReport: Record<string, any>): void;
    //for the current design, I need a way to create an excerpt and note at the same time - and maybe create a report as well if one does not already exist
    //I'm not really sure at this point what all params need to be passed through
    //it might also be nice to have this method kick off the update pocket api call
    addOrUpdateExcerpt(pocketId: string, documentId: string, excerpt: string, note: string, reportId?: string): void;
}
