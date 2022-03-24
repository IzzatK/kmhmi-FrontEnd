import {VisualWrapper} from "../../../framework.visual";
import {createVisualConnector} from "../../../framework.visual";
import {createSelector} from "@reduxjs/toolkit";
import {selectionService, tagService} from "../../../serviceComposition";
import {TagInfoVM, TagsPanelAppDispatchProps, TagsPanelAppStateProps} from "./tagsPanelModel";
import {forEach} from "../../../framework.core/extras/utils/collectionUtils";
import {TagInfo} from "../../../app.model";
import TagsPanelPresenter from "./presenters/tagsPanelPresenter";

class _TagsPanelWrapper extends VisualWrapper {
    constructor() {
        super();

        this.id ='app.visual/components/tagsPanel';

        this.view = TagsPanelPresenter;

        this.displayOptions = {
            containerId: 'system-tool-panel',
            visible: false,
            appearClass: 'fadeIn',
            enterClass: 'fadeIn',
        };

        this.mapStateToProps = (state: any, props: any): TagsPanelAppStateProps => {
            return {
                tags: this.getTagVMs(state),
                nominatedTags: {}
            }
        }

        this.mapDispatchToProps = (dispatch: any): TagsPanelAppDispatchProps => {
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
    connectedPresenter: TagsPanelWrapper,
    componentId: TagsPanelId
} = createVisualConnector(_TagsPanelWrapper);
