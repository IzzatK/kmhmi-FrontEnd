import {EntityProvider} from "../../common/providers/entityProvider";
import {PocketInfo} from "../../../app.model";

export const serverUrl = process.env.REACT_APP_SERVER_URL;

export class PocketProvider extends EntityProvider<PocketInfo> {
    baseUrl: string = `${serverUrl}/documents`;
    public static class: string = 'PocketProvider';

    constructor() {
        super();
        super.appendClassName(PocketProvider.class);
    }

    start() {
        super.start();
    }


}


