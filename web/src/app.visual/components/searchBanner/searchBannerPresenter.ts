import {createSelector} from "@reduxjs/toolkit";
import SearchBannerView from "./searchBannerView";
import {Presenter} from "../../../framework.visual/extras/presenter";
import {createComponentWrapper} from "../../../framework.visual/wrappers/componentWrapper";
import {forEach} from "../../../framework.visual/extras/utils/collectionUtils";
import {
    displayService,
    documentService,
    referenceService,
    repoService,
    tagService
} from "../../../serviceComposition";
import {ReferenceInfo, ReferenceType, SearchBannerMenuItem, SearchParamInfo, TagInfo} from "../../../app.model";
import {MenuItemVM} from "../../../framework.visual/model/menuItemVM";
import {SearchParamItemVM} from "./searchBannerModel";

const VIEW_ID = 'search-banner-tools';

class SearchBanner extends Presenter {
    constructor() {
        super();

        this.id = 'components/searchBanner';

        this.view = SearchBannerView;

        this.mapStateToProps = (state: any) => {

            return {
                tools: this.getToolVMs(state),
                searchText: documentService.getSearchText(),
                searchParamsBasic: this.getSearchParamsBasicVMs(state),
                searchParamsAdvanced: this.getSearchParamsAdvancedVMs(state)
            }
        }

        this.mapDispatchToProps = () => {
            return {
                onSearch: () => {
                    displayService.popNode(VIEW_ID);
                    documentService.fetchDocuments()
                },
                onSearchParamChanged: (id: string, value: string | string[] ) => documentService.setSearchParam(id, value),
                onSearchTextChanged: (value: string) => documentService.setSearchText(value),
                onToolSelected: (id: string) => this.onToolSelected(id),
                onClearSearch: () => documentService.clearSearch()
            };
        }
    }

    getTools = () => {
        return repoService.getAll<SearchBannerMenuItem>(SearchBannerMenuItem.class);
    }

    onToolSelected(nextId: string) {
        let currentId = displayService.getSelectedNodeId(VIEW_ID)

        if (currentId === nextId) {
            displayService.popNode(VIEW_ID);
        } else {
            displayService.pushNode(nextId);
        }
    }


    getToolVMs = createSelector(
        [() => displayService.getSelectedNodeId(VIEW_ID), () => this.getTools()], // if this changes, will re-evaluate the combiner and trigger a re-render
        (selectedId, items) => {
            let itemVMs: Record<string, MenuItemVM> = {};

            // build the hash map used to redux data
            forEach(items, (item: SearchBannerMenuItem) => {
                itemVMs[item.id] = {
                    id: item.id,
                    title: item.title,
                    graphic: item.graphic,
                    context: item.context,
                    selected: selectedId === item.id
                };
            })

            return Object.values(itemVMs);
        }
    );

    createItemVM(itemVMs: Record<string, SearchParamItemVM>, item: SearchParamInfo, referenceTypes: Record<ReferenceType, Record<string, ReferenceInfo>>, publicTags: Record<string, TagInfo>) {
        const { id, type, value, title, dirty, options, optionsId} = item;

        let itemVM:SearchParamItemVM = {
            id,
            type,
            value,
            title,
            dirty,
            options,
        };

        if (id === 'tags') {
            itemVM.options = {
                ...publicTags,
            }
        } else if (optionsId && referenceTypes) {
            let index;
            switch (optionsId) {
                case 'DEPARTMENT':
                    index = ReferenceType.DEPARTMENT;
                    break;
                case 'PURPOSE':
                    index = ReferenceType.PURPOSE;
                    break;
                case 'ROLE':
                    index = ReferenceType.ROLE;
                    break;
                case 'STATUS':
                default:
                    index = ReferenceType.STATUS;
                    break;
            }
            itemVM.options = {
                ...referenceTypes[index],
            };
        }

        itemVMs[id] = itemVM;
    }

    getSearchParamsBasicVMs = createSelector(
        [documentService.getSearchParams, () => referenceService.getAllReferencesGroupedByType(), tagService.getAllPublicTags],
        (items, referenceTypes, publicTags) => {
            let itemVMs: Record<string, SearchParamItemVM> = {};

            forEach(items, (item: SearchParamInfo) => {
                if (item.visible && !item.advanced) {
                    this.createItemVM(itemVMs, item, referenceTypes, publicTags)
                }
            });
            return Object.values(itemVMs);
        }
    );

    getSearchParamsAdvancedVMs = createSelector(
        [documentService.getSearchParams, referenceService.getAllReferencesGroupedByType, tagService.getAllPublicTags],
        (items, referenceTypes, publicTags) => {
            let itemVMs: Record<string, SearchParamItemVM> = {};

            forEach(items, (item: SearchParamInfo) => {
                if (item.visible && item.advanced) {
                    this.createItemVM(itemVMs, item, referenceTypes, publicTags)
                }
            });
            return Object.values(itemVMs);
        }
    );
}

export const {
    connectedPresenter: SearchBannerPresenter,
    componentId: SearchBannerId
} = createComponentWrapper(SearchBanner);
