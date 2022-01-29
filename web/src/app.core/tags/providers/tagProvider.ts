import {EntityProvider} from "../../common/providers/entityProvider";
import {TagInfo} from "../../../app.model";
import {GetTagArrayRequestConverter} from "../converters/getTagArrayRequestConverter";
import {GetTagArrayResponseConverter} from "../converters/getTagArrayResponseConverter";
import {GetTagResponseConverter} from "../converters/getTagResponseConverter";

const serverUrl = process.env.REACT_APP_SERVER_URL;

export class TagProvider extends EntityProvider<TagInfo> {
    baseUrl: string = `${serverUrl}/-custom-shared-tags`;
    public static class: string = 'TagProvider';

    private getTagResponseConverter!: GetTagResponseConverter;

    private getTagArrayRequestConverter!: GetTagArrayRequestConverter;
    private getTagArrayResponseConverter!: GetTagArrayResponseConverter;

    constructor() {
        super();
        super.appendClassName(TagProvider.class);
    }

    start() {
        super.start();

        this.getTagResponseConverter = this.addConverter(GetTagResponseConverter);

        this.getTagArrayRequestConverter = this.addConverter(GetTagArrayRequestConverter);
        this.getTagArrayResponseConverter = this.addConverter(GetTagArrayResponseConverter);
        this.getTagArrayResponseConverter.singleConverter = this.getTagResponseConverter;
    }

    getAll(uiRequestData?: any): Promise<TagInfo[]> {
        return new Promise((resolve, reject) => {
            super.sendGetAll(
                () => this.getTagArrayRequestConverter.convert(uiRequestData),
                (responseData, reject) => this.getTagArrayResponseConverter.convert(responseData, reject))
                .then(data => {
                    resolve(data);
                })
                .catch(error => {
                    reject(error);
                })
        });
    }
}


