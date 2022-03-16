import {EntityProvider} from "../../common/providers/entityProvider";
import {PocketMapper} from "../../../app.model";

const serverUrl = process.env.REACT_APP_SERVER_URL;

export class PocketProvider extends EntityProvider<PocketMapper> {
    baseUrl: string = `${serverUrl}/pockets`;
    public static class: string = 'PocketProvider';

    constructor() {
        super();
        super.appendClassName(PocketProvider.class);
    }

    start() {
        super.start();

    }
}


