import {createSelector, Selector} from "@reduxjs/toolkit";
import {MetadataInfo, TagInfo} from "../../app.model";
import {ITagService} from "../../app.core.api";
import {Plugin} from "../../framework.core/extras/plugin";
import {Nullable} from "../../framework.core/extras/utils/typeUtils";
import {IEntityProvider} from "../../framework.api";

export class TagService extends Plugin implements ITagService {
    public static readonly class: string = 'TagService';

    private readonly getAllPublicTagsSelector: Selector<any, Record<string, TagInfo>>;
    private tagProvider: Nullable<IEntityProvider<TagInfo>> = null;

    constructor() {
        super();
        this.appendClassName(TagService.class);

        this.getAllPublicTagsSelector = createSelector(
            [() => super.getAll<TagInfo>(TagInfo.class)],
            (items) => {
                return items;
            }
        );
    }

    setTagProvider(provider: IEntityProvider<TagInfo>): void {
        this.tagProvider = provider;
    }

    start() {
        super.start();
    }

    stop() {
        super.stop();
    }

    configure() {
        super.configure();
    }

    getAllPublicTags() {
        return this.getAllPublicTagsSelector(super.getRepoState());
    }

    fetchTags() {
        this.setLoading(true);

        this.tagProvider?.getAll()
            .then(responseData => {
                this.removeAllByType(TagInfo.class)
                this.addOrUpdateAllRepoItems(responseData)

                this.setLoading(false);
            })
            .catch(error => {
                console.log(error);
                this.setLoading(false);
            });
    }

    setLoading(isLoading: boolean) {
        let repoItem = super.getRepoItem<MetadataInfo>(MetadataInfo.class, 'tags-loading-info');

        if (repoItem == null) {
            repoItem = new MetadataInfo('tags-loading-info');
        }
        repoItem.isLoading = isLoading;

        this.addOrUpdateRepoItem(repoItem);
    }

    getTagsLoading() {
        let result = false;

        let repoItem = super.getRepoItem<MetadataInfo>(MetadataInfo.class, 'tags-loading-info');

        if (repoItem != null) {
            result = repoItem.isLoading;
        }

        return result;
    }
}
