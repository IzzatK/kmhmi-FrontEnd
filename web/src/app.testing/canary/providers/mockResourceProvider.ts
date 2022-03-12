import {ResourceInfo} from "../../../app.model";
import {MockProvider} from "./mockProvider";

const serverUrl = process.env.REACT_APP_SERVER_URL;


export class MockResourceProvider extends MockProvider<ResourceInfo> {
    baseUrl: string = `${serverUrl}/pockets/resources`;
    public static class: string = 'MockResourceProvider';

    constructor() {
        super(ResourceInfo);
    }
}


