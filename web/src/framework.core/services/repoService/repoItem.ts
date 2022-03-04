export interface IRepoItem {
    id: string;
    className: string;
}

export abstract class RepoItem implements IRepoItem {

    public static class: string = 'RepoItem';
    public className: string = '';

    protected constructor(
        public id: string)
    {
        this.id = id;
        // add an enclosing '/' to the end for faster lookup
        this.appendClassName(`${RepoItem.class}/`);
    }

    protected appendClassName(className: string) {
        this.className = `/${className}${this.className}`;
    }

}
