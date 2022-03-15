import TagsPanelView from "./tagsPanelView";
import {Presenter} from "../../../../framework.visual/extras/presenter";
import {createComponentWrapper} from "../../../../framework.visual/wrappers/componentWrapper";
import {createSelector} from "@reduxjs/toolkit";
import {selectionService, tagService} from "../../../../serviceComposition";
import {TagInfoVM} from "./tagsPanelModel";
import {forEach} from "../../../../framework.core/extras/utils/collectionUtils";
import {TagInfo} from "../../../../app.model";

class TagsPanel extends Presenter {
    constructor() {
        super();

        this.id ='app.visual/components/tagsPanel';

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
                onTagSelected: (id: string) => this.onTagSelected(id),
            };
        }
    }

    onTagSelected(id: string) {
        selectionService.setContext("selected-tag", id);
    }

    getTagVMs = createSelector(
        [tagService.getAllPublicTags],
        (items) => {
            let itemVMs: TagInfoVM[] = [];

            forEach(items, (item: TagInfo) => {
                const { id, title } = item;

                let itemVM: TagInfoVM = {
                    id,
                    title: title ? title.toLowerCase() : "",
                }

                itemVMs.push(itemVM);
            });

            let sortedArray: TagInfoVM[];

            sortedArray = itemVMs.sort((a, b) => {
                return a.title.localeCompare(b.title);
            })

            let alphabetArray: Record<string, TagInfoVM[]> = {};

            sortedArray.map((itemVM) => {
                const { title } = itemVM;
                let letter = title.charAt(0).toUpperCase();

                if (!alphabetArray[letter]) {
                    alphabetArray[letter] = [];
                }

                alphabetArray[letter].push(itemVM);
            });

            return alphabetArray;
        }
    )
}

export const {
    connectedPresenter: TagsPanelPresenter,
    componentId: TagsPanelId
} = createComponentWrapper(TagsPanel);
