import {MenuItem} from "../../framework/model/menuItem";

export class SearchResultsMenuItem extends MenuItem {
    public static class: string = 'SearchResultsMenuItem';

    constructor(id: string) {
        super(id);

        this.appendClassName(SearchResultsMenuItem.class);
    }
}
