import {EntityProvider} from "../../common/providers/entityProvider";
import {UserGuideInfo} from "../../../app.model";
import {Nullable} from "../../../framework.core/extras/utils/typeUtils";

const serverUrl = process.env.REACT_APP_SERVER_URL;

export class UserGuideProvider extends EntityProvider<UserGuideInfo> {
    baseUrl: string = `${serverUrl}/guides`;
    public static class: string = 'UserGuideProvider';

    userGuideInfo: UserGuideInfo = new UserGuideInfo("userGuideInfoId");

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
        const me = this;
        let docName: string = "KM%20User%20Management.pdf";
        // let docName: string = "KM%20Upload%20Manager.pdf";
        // let docName: string = "KM%20Search.pdf";

        return new Promise((resolve, reject) => {
            me.userGuideInfo.preview_url = `${this.baseUrl}/${docName}`
            resolve(me.userGuideInfo);
        });

        // return new Promise((resolve, reject) => {
        //     super.sendGetSingle(id,
        //         (responseData, errorHandler) => this.userGuideResponseConverter.convert(responseData, errorHandler))
        //         .then(data => {
        //             resolve(data);
        //         })
        //         .catch(error => {
        //             reject(error);
        //         });
        // });
    }
}