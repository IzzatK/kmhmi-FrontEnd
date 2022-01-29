import TagsPanelView from "./tagsPanelView";
import {Presenter} from "../../../../framework.visual/extras/presenter";
import {createComponentWrapper} from "../../../../framework/wrappers/componentWrapper";
import {createSelector} from "@reduxjs/toolkit";
import {tagService} from "../../../../core/serviceComposition";
import {TagInfoVM} from "./tagsPanelModel";
import {forEach} from "../../../../framework.visual/extras/utils/collectionUtils";
import {TagInfo} from "../../../../model";

class TagsPanel extends Presenter {
    constructor() {
        super();

        this.id ='components/tagsPanel';

        this.view = TagsPanelView;

        this.displayOptions = {
            containerId: 'system-tool-panel',
            visible: false,
            appearClass: 'fadeIn',
            enterClass: 'fadeIn',
        };

        this.mapStateToProps = (state: any, props: any) => {
            return {
                tags: this.getTagVMs(state),
            }
        }

        this.mapDispatchToProps = (dispatch: any) => {
            return {

            };
        }
    }

    getTagVMs = createSelector(
        [tagService.getAllPublicTags],
        (items) => {
            let itemVMs: TagInfoVM[] = [];

            forEach(items, (item: TagInfo) => {
                const { id, title } = item;

                let itemVM: TagInfoVM = {
                    id,
                    title: title.toLowerCase(),
                }

                itemVMs.push(itemVM);
            });

            let sortedArray: TagInfoVM[];

            sortedArray = itemVMs.sort((a, b) => {
                return a.title.localeCompare(b.title);
            })

            return sortedArray;
        }
    )
}

export const {
    connectedPresenter: TagsPanelPresenter,
    componentId: TagsPanelId
} = createComponentWrapper(TagsPanel);
