import {EntityProvider} from "../../common/providers/entityProvider";
import {ExcerptInfo, PocketInfo, PocketMapper, ReportInfo} from "../../../app.model";
import {Nullable} from "../../../framework.core/extras/typeUtils";
import {forEach} from "../../../framework.visual/extras/utils/collectionUtils";
import {makeGuid} from "../../../framework.visual/extras/utils/uniqueIdUtils";
import {ReportMapper} from "../../../app.model/pockets/mappers/reportMapper";
import {ExcerptParamType} from "../../../app.core.api";

export const serverUrl = process.env.REACT_APP_SERVER_URL;

export class MockExcerptProvider extends EntityProvider<ExcerptInfo> {
    baseUrl: string = `${serverUrl}/pockets/excerpts`;
    public static class: string = 'MockExcerptProvider';

    constructor() {
        super();
        super.appendClassName(MockExcerptProvider.class);
    }

    create(uiRequestData: ExcerptParamType, onUpdated?: (item: ExcerptInfo) => void): Promise<Nullable<ExcerptInfo>> {
        return new Promise((resolve, reject) => {
            let result = generateExcerpt(uiRequestData);

            resolve(result);
        });
    }
}

const generateExcerpt = (data: ExcerptParamType): ExcerptInfo => {
   const excerpt = new ExcerptInfo(makeGuid());

   excerpt.content = data.content || excerpt.content;
   excerpt.text = data.text || excerpt.text;
   excerpt.location = data.location || excerpt.location;

   return excerpt;
}


