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

    //Josiah's requests
    updateReport(modifiedReport: Record<string, any>): void;
    //for the current design, I need a way to create an excerpt and note at the same time - and maybe create a report as well if one does not already exist
    //I'm not really sure at this point what all params need to be passed through
    //it might also be nice to have this method kick off the update pocket api call
    addOrUpdateExcerpt(pocketId: string, documentId: string, excerpt: string, note: string, reportId?: string): void;
}
