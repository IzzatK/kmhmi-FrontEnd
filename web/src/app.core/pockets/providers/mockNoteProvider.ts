import {EntityProvider} from "../../common/providers/entityProvider";
import {ExcerptInfo, NoteInfo, PocketInfo, PocketMapper, ReportInfo} from "../../../app.model";
import {Nullable} from "../../../framework.core/extras/typeUtils";
import {forEach} from "../../../framework.visual/extras/utils/collectionUtils";
import {makeGuid} from "../../../framework.visual/extras/utils/uniqueIdUtils";
import {ReportMapper} from "../../../app.model/pockets/mappers/reportMapper";
import {NoteParamType} from "../../../app.core.api";

export const serverUrl = process.env.REACT_APP_SERVER_URL;


export class MockNoteProvider extends EntityProvider<NoteInfo> {
    baseUrl: string = `${serverUrl}/pockets/notes`;
    public static class: string = 'MockNoteProvider';

    constructor() {
        super();
        super.appendClassName(MockNoteProvider.class);
    }

    create(uiRequestData: NoteParamType, onUpdated?: (item: NoteInfo) => void): Promise<Nullable<NoteInfo>> {
        return new Promise((resolve, reject) => {
            let result = generateExcerpt(uiRequestData);

            resolve(result);
        });
    }
}

const generateExcerpt = (data: NoteParamType): NoteInfo => {
    const note = new NoteInfo(makeGuid());

    note.content = data.content || note.content;
    note.text = data.text || note.text;

    return note;
}


