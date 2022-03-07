import {MenuItem} from "../framework.core/model";

export class SearchBannerMenuItem extends MenuItem {
    public static class: string = 'SearchBannerMenuItem';

    constructor(id: string) {
        super(id);

        this.appendClassName(SearchBannerMenuItem.class);
    }
}
