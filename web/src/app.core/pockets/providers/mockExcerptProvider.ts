import {EntityProvider} from "../../common/providers/entityProvider";
import {ExcerptInfo, PocketInfo, PocketMapper, ReportInfo} from "../../../app.model";
import {Nullable} from "../../../framework.core/extras/typeUtils";
import {forEach} from "../../../framework.visual/extras/utils/collectionUtils";
import {makeGuid} from "../../../framework.visual/extras/utils/uniqueIdUtils";
import {ReportMapper} from "../../../app.model/pockets/mappers/reportMapper";

export const serverUrl = process.env.REACT_APP_SERVER_URL;

type CreateExcerptType = {
    text: string,
    location: string,
    content: string,
    authorId: string
};

export class MockExcerptProvider extends EntityProvider<ExcerptInfo> {
    baseUrl: string = `${serverUrl}/pockets/excerpts`;
    public static class: string = 'MockExcerptProvider';

    constructor() {
        super();
        super.appendClassName(MockExcerptProvider.class);
    }

    create(uiRequestData: CreateExcerptType, onUpdated?: (item: ExcerptInfo) => void): Promise<Nullable<ExcerptInfo>> {
        return new Promise((resolve, reject) => {
            let result = generateExcerpt(uiRequestData);

            resolve(result);
        });
    }
}

const generateExcerpt = (data: CreateExcerptType): ExcerptInfo => {
   const excerpt = new ExcerptInfo(makeGuid());

   excerpt.content = data.content;
   excerpt.text = data.text;
   excerpt.location = data.location;

   return excerpt;
}


