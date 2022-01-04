import SearchAdvancedPanelView from './searchAdvancedPanelView'
import {Presenter} from "../../../framework.visual/extras/presenter";
import {createComponentWrapper} from "../../../framework/wrappers/componentWrapper";
import {createSelector} from "@reduxjs/toolkit";

import {forEach} from "../../../framework.visual/extras/utils/collectionUtils";
import {documentService, referenceService, tagService} from "../../../application/serviceComposition";

class SearchAdvancedPanel extends Presenter {
    constructor(props) {
        super(props);

        super.id ='components/searchAdvancedPanel';

        super.view = SearchAdvancedPanelView;

        super.mapStateToProps = (state, props) => {
            return {
                searchParams: this.getSearchParamsVMs(state),
                searchParamTypes: this.getSearchParamTypes(state)
            }
        }

        super.mapDispatchToProps = (dispatch) => {
            return {
                onSearchParamChanged: (id, value) => documentService.setSearchParam(id, value),
                onCriterionAdded: (id) => documentService.setVisibility(id, true),
                onCriterionRemoved: (id) => documentService.setVisibility(id, false)
            };
        }

        super.displayOptions = {
            containerId: 'search-banner-tools',
            visible: false,
            appearClass: '',
            enterClass: '',
            exitClass: 'fadeOut',
        };
    }

    getSearchParamsVMs = createSelector(
        [documentService.getSearchParams, () => referenceService.getAllReferencesGroupedByType(), tagService.getAllPublicTags],
        (items, referenceTypes, publicTags) => {
            let itemVMs = {};

            forEach(items, (item) => {
                const { id, type, value, title, advanced=true, visible=false, optionsId, timestamp} = item;

                // only show advanced parameters
                if (advanced && visible) {
                    let itemVM = {
                        id,
                        type,
                        value,
                        title,
                        timestamp,
                    };

                    if (id === 'tags') {
                        itemVM.options = publicTags;
                    }
                    else if (optionsId) {
                        itemVM.options = referenceTypes[optionsId] ? referenceTypes[optionsId] : {};
                    }

                    itemVMs[item.id] = itemVM;
                }
            });

            return Object.values(itemVMs)
                .sort(function(a,b) {
                    return b.timestamp - a.timestamp;
                });
        }
    );

    getSearchParamTypes = createSelector(
        [documentService.getSearchParams],
        (items) => {
            let itemVMs = {};

            forEach(items, (item) => {
                const { id, advanced, title, visible=false} = item;

                // only show advanced parameters
                if (!visible && advanced) {
                    itemVMs[item.id] = {
                        id,
                        title
                    };
                }
            });

            return Object.values(itemVMs)
                .sort(function(a, b) {
                    const textA = a.title.toUpperCase();
                    const textB = b.title.toUpperCase();
                    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
            });
        }
    )
}


export const {
    connectedPresenter: SearchAdvancedPanelPresenter,
    componentId: SearchAdvancedPanelPresenterId
} = createComponentWrapper(SearchAdvancedPanel);
