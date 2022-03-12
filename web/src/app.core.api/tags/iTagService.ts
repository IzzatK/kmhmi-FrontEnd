import {IPlugin} from "../../framework.api";
import {IEntityProvider} from "../../framework.api/iEntityProvider";
import {TagInfo} from "../../app.model";

export interface ITagService extends IPlugin {
    fetchTags(): void;

    getTagsLoading(state: any): boolean;

    setTagProvider(provider: IEntityProvider<TagInfo>): void;

    getAllPublicTags(): Record<string, TagInfo>;
}
