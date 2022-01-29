import {MenuItem} from "../../framework/model/menuItem";

export class SearchBannerMenuItem extends MenuItem {
    public static class: string = 'SearchBannerMenuItem';

    constructor(id: string) {
        super(id);

        this.appendClassName(SearchBannerMenuItem.class);
    }
}
