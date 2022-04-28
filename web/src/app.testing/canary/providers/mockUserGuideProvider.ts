import {EntityProvider} from "../../../app.core";
import {UserGuideInfo} from "../../../app.model";
import {Nullable} from "../../../framework.core/extras/utils/typeUtils";

const serverUrl = process.env.REACT_APP_SERVER_URL;

export class MockUserGuideProvider extends EntityProvider<UserGuideInfo> {
    baseUrl: string = `${serverUrl}/guides`;
    public static class: string = 'UserGuideProvider';

    userGuideInfo: UserGuideInfo = new UserGuideInfo("userGuideInfoId");

    constructor() {
        super();
        super.appendClassName(MockUserGuideProvider.class);
    }

    start() {
        super.start();
    }

    getSingle(id: string): Promise<Nullable<UserGuideInfo>> {
        const me = this;
        // let docName: string = "KM%20User%20Management.pdf";
        // let docName: string = "KM%20Upload%20Manager.pdf";
        let docName: string = "KM%20Search.pdf";

        return new Promise((resolve, reject) => {
            // me.userGuideInfo.preview_url = "http://18.253.49.141:5000/KMAPI/guides/KM%20User%20Management.pdf";
            // me.userGuideInfo.preview_url = "http://18.253.49.141:5000/KMAPI/guides/KM%20Upload%20Manager.pdf";
            // me.userGuideInfo.preview_url = "http://18.253.49.141:5000/KMAPI/guides/KM%20Search.pdf";
            me.userGuideInfo.preview_url = `${this.baseUrl}/${docName}`
            resolve(me.userGuideInfo);
        });
    }
}