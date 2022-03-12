import {NoteInfo} from "../../../app.model";
import {MockProvider} from "./mockProvider";

const serverUrl = process.env.REACT_APP_SERVER_URL;


export class MockNoteProvider extends MockProvider<NoteInfo> {
    baseUrl: string = `${serverUrl}/pockets/notes`;
    public static class: string = 'MockNoteProvider';

    constructor() {
        super(NoteInfo);
    }
}


