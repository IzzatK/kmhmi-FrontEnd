import {RepoItem} from "../services";

export class MenuItem extends RepoItem {
    public static class: string = 'MetadataInfo';

    title: string = '';
    selected: boolean = false;
    graphic: any = null;
    context: any = null;

    constructor(id: string)
    {
        super(id);

        this.appendClassName(MenuItem.class);
    }
}
