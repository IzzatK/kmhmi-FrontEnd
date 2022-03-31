import {IPlugin} from "../../framework.core.api";
import {IEntityProvider} from "../../framework.core.api/iEntityProvider";
import {TagInfo} from "../../app.model";
import {Nullable} from "../../framework.core/extras/utils/typeUtils";

export interface ITagService extends IPlugin {
    fetchTags(): void;

    getTagsLoading(state: any): boolean;

    setTagProvider(provider: IEntityProvider<TagInfo>): void;

    getAllPublicTags(): Record<string, TagInfo>;

    searchTags(text:string): Promise<TagInfo[]>;
}
