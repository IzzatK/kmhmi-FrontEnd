import {createSelector} from "@reduxjs/toolkit";
import {VisualWrapper} from "../../../framework.visual";
import {createVisualConnector} from "../../../framework.visual";
import {forEach} from "../../../framework.core/extras/utils/collectionUtils";
import {
    displayService,
    documentService,
    referenceService,
    repoService,
    tagService
} from "../../../serviceComposition";
import {ReferenceInfo, ReferenceType, SearchBannerMenuItem, SearchParamInfo, TagInfo} from "../../../app.model";
import {MenuItemVM} from "../../../framework.visual";
import {SearchBannerAppDispatchProps, SearchBannerAppStateProps, SearchParamItemVM} from "./searchBannerModel";
import SearchBannerPresenter from "./presenter/searchBannerPresenter";

const VIEW_ID = 'search-banner-tools';

class _SearchBannerWrapper extends VisualWrapper {
    constructor() {
        super();

        this.id = 'components/searchBanner';

        this.view = SearchBannerPresenter;

        this.mapStateToProps = (state: any): SearchBannerAppStateProps => {

            return {
                tools: this._getToolVMs(state),
                searchText: documentService.getSearchText(),
                searchParamsBasic: this._getSearchParamsBasicVMs(state),
                searchParamsAdvanced: this._getSearchParamsAdvancedVMs(state)
            }
        }

        this.mapDispatchToProps = (dispatch: any): SearchBannerAppDispatchProps => {
            return {
                onSearch: () => {documentService.fetchSearchResults()},
                onSearchParamChanged: (id: string, value: string | string[] ) => this._onSearchParamsChanged(id, value),
                onSearchTextChanged: (value: string) => documentService.setSearchText(value),
                onToolSelected: (id: string) => this._onToolSelected(id),
                onClearSearch: () => documentService.clearSearch()
            };
        }
    }

    _getTools = () => {
        return repoService.getAll<SearchBannerMenuItem>(SearchBannerMenuItem.class);
    }

    _onToolSelected(nextId: string) {
        let currentId = displayService.getSelectedNodeId(VIEW_ID)

        if (currentId === nextId) {
            displayService.popNode(VIEW_ID);
        } else {
            displayService.pushNode(nextId);
        }
    }

    _onSearchParamsChanged(id: string, value: string | string[]) {
        documentService.setSearchParam(id, value);
    }


    _getToolVMs = createSelector(
        [() => displayService.getSelectedNodeId(VIEW_ID), () => this._getTools()], // if this changes, will re-evaluate the combiner and trigger a re-render
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

    _createItemVM(itemVMs: Record<string, SearchParamItemVM>, item: SearchParamInfo, referenceTypes: Record<ReferenceType, Record<string, ReferenceInfo>>, publicTags: Record<string, TagInfo>) {
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

    _getSearchParamsBasicVMs = createSelector(
        [documentService.getSearchParams, () => referenceService.getAllReferencesGroupedByType(), tagService.getAllPublicTags],
        (items, referenceTypes, publicTags) => {
            let itemVMs: Record<string, SearchParamItemVM> = {};

            forEach(items, (item: SearchParamInfo) => {
                if (item.visible && !item.advanced) {
                    this._createItemVM(itemVMs, item, referenceTypes, publicTags)
                }
            });
            return Object.values(itemVMs);
        }
    );

    _getSearchParamsAdvancedVMs = createSelector(
        [documentService.getSearchParams, referenceService.getAllReferencesGroupedByType, tagService.getAllPublicTags],
        (items, referenceTypes, publicTags) => {
            let itemVMs: Record<string, SearchParamItemVM> = {};

            forEach(items, (item: SearchParamInfo) => {
                if (item.visible && item.advanced) {
                    this._createItemVM(itemVMs, item, referenceTypes, publicTags)
                }
            });
            return Object.values(itemVMs);
        }
    );
}

export const {
    connectedPresenter: SearchBannerWrapper,
    componentId: SearchBannerId
} = createVisualConnector(_SearchBannerWrapper);
