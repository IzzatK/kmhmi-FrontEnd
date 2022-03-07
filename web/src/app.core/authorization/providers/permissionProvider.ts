import {EntityProvider} from "../../common/providers/entityProvider";
import {GetPermissionArrayResponseConverter} from "../converters/getPermissionArrayResponseConverter";
import {PermissionInfo} from "../../../app.model";
import {GetPermissionArrayRequestConverter} from "../converters/getPermissionArrayRequestConverter";

const serverUrl = process.env.REACT_APP_SERVER_URL;

export class PermissionProvider extends EntityProvider<PermissionInfo> {

    baseUrl: string = `${serverUrl}/users/-role-function`;
    public static class: string = 'PermissionProvider';
    private getPermissionArrayResponseConverter!: GetPermissionArrayResponseConverter;
    private getPermissionArrayRequestConverter!: GetPermissionArrayRequestConverter;


    constructor() {
        super();
        super.appendClassName(PermissionProvider.class);
    }

    start() {
        super.start();

        this.getPermissionArrayResponseConverter = this.addConverter(GetPermissionArrayResponseConverter);
        this.getPermissionArrayRequestConverter = this.addConverter(GetPermissionArrayRequestConverter);
    }

    getAll(uiRequestData: {userId:string}) : Promise<PermissionInfo[]> {

        return new Promise((resolve, reject) => {
            super.sendGetAll(
                () => this.getPermissionArrayRequestConverter.convert(uiRequestData),
                (responseData, reject) => this.getPermissionArrayResponseConverter.convert(responseData, reject, uiRequestData))
                .then(data => {
                    resolve(data);
                })
                .catch(error => {
                    reject(error);
                })
        });
    }


}
