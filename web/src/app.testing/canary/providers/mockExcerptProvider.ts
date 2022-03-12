import {ExcerptInfo} from "../../../app.model";
import {MockProvider} from "./mockProvider";

const serverUrl = process.env.REACT_APP_SERVER_URL;

export class MockExcerptProvider extends MockProvider<ExcerptInfo> {
    baseUrl: string = `${serverUrl}/pockets/excerpts`;
    public static class: string = 'MockExcerptProvider';

    constructor() {
        super(ExcerptInfo);
    }
}


