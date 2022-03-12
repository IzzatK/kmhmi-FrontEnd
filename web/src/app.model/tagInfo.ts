import {RepoItem} from "../framework.core/services";
import {TagType} from "./tagType";

export class TagInfo extends RepoItem {
    public static class: string = 'TagInfo';

    constructor(
        public id: string,
        public title: string,
        public user_id?: string,
        public type?: TagType
    )
    {
        super(id);
        this.appendClassName(TagInfo.class);

        this.title = title;
        this.user_id = user_id;
        this.type = type;
    }
}
