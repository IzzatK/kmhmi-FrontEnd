import {EntityProvider} from "../../common/providers/entityProvider";
import {UserGuideInfo} from "../../../app.model";
import {Nullable} from "../../../framework.core/extras/utils/typeUtils";

const serverUrl = process.env.REACT_APP_SERVER_URL;

export class UserGuideProvider extends EntityProvider<UserGuideInfo> {
    baseUrl: string = `${serverUrl}/userGuide`;
    public static class: string = 'UserGuideProvider';

    // TODO: declare converters

    constructor() {
        super();
        super.appendClassName(UserGuideProvider.class);
    }

    start() {
        super.start();

        // TODO: add converters
    }

    getSingle(id: string): Promise<Nullable<UserGuideInfo>> {
        return new Promise((resolve, reject) => {
            // me.userGuideInfo.preview_url = "http://18.253.49.141:5000/KMAPI/documents/c3871ce4-38ba-4189-9d5e-e1678a048edf?format=PREVIEW";
            // resolve(me.userGuideInfo);
        });
    }
}