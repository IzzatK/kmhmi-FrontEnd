import {SearchGraphsPanelView} from './searchGraphsPanelView'
import {VisualWrapper} from "../../../framework.visual/extras/visualWrapper";
import {createVisualConnector} from "../../../framework.visual/connectors/visualConnector";
import {createSelector} from "@reduxjs/toolkit";
import {ReferenceInfo, ReferenceType, StatType} from "../../../app.model";
import {forEach, forEachKVP} from "../../../framework.core/extras/utils/collectionUtils";
import {documentService, referenceService, statService} from "../../../serviceComposition";
import {ReferenceInfoVM, SearchGraphsDispatchProps, SearchGraphsStateProps, StatVM} from "./searchGraphsModel";

class SearchGraphsPanel extends VisualWrapper {
    constructor() {
        super();

        this.id ='components/searchGraphsPanel';

        this.view = SearchGraphsPanelView;

        this.mapStateToProps = (state: any, props: any) : SearchGraphsStateProps => {
            return {
                customTagsData: this.getCustomSharedTagsStatsVMs(state),
                totalUploadsData: this.getTotalUploadsStatsVMs(state),
                departmentData: this.getDepartmentStatsVMs(state),
                purposeData: this.getPurposeStatsVMs(state),
                docTypeData: this.getDocTypeStatsVMs(state),
                isExpanded: !this.hasSearchResults(state),
            }
        }

        this.mapDispatchToProps = (): SearchGraphsDispatchProps => {
            return {
                onSearchParamChanged: this._onSearchParamsChanged
            };
        }

        this.displayOptions = {
            containerId: 'search-banner-tools',
            visible: false,
            appearClass: 'fadeIn',
            enterClass: 'fadeIn',
            exitClass: 'fadeOut',
        }
    }

    _onSearchParamsChanged(id:string, value: string) {
        switch (id) {
            default: {
                documentService.clearSearch();
                let searchParam = documentService.getSearchParam(id);

                let currentValues = new Set<string>(searchParam?.value || []);

                if (currentValues.has(value)) {
                    currentValues.delete(value);
                }
                else {
                    currentValues.add(value);
                }

                documentService.setSearchParam(id, Array.from(currentValues))
            }
        }
    }

    getCustomSharedTagsStatsVMs = createSelector(
        [() => statService.getStats(StatType.CUSTOM_SHARED_TAG)],
        (stats) => {

            let itemVMs: Record<string, StatVM> = {};

            forEach(stats, (stat: StatVM) => {
                const { id, type, item, count} = stat;

                itemVMs[id] = {
                    id,
                    item,
                    count,
                };
            });

            return Object.values(itemVMs);
        }
    );

    getTotalUploadsStatsVMs = createSelector(
        [() => statService.getStats(StatType.UPLOAD_DATE)],
        (stats) => {
            let itemVMs: Record<string, StatVM> = {};

            forEach(stats, (stat: StatVM) => {
                const { id, type, item, count} = stat;

                itemVMs[id] = {
                    id: item,
                    item,
                    count,
                };
            });

            return Object.values(itemVMs);
        }
    );

    getDepartmentVMs = createSelector(
        [() => referenceService.getAllReferences(ReferenceType.DEPARTMENT)],
        (departments) => {
            let itemVMs: Record<string, ReferenceInfoVM> = {};

            forEachKVP(departments, (itemKey: string, itemValue: ReferenceInfo) => {
                itemVMs[itemKey] = {
                    ...itemValue
                };
            })

            return itemVMs;
        }
    )

    getDepartmentStatsVMs = createSelector(
        [() => statService.getStats(StatType.DEPARTMENT), this.getDepartmentVMs],
        (stats, departments) => {
            let itemVMs: Record<string, StatVM> = {};

            console.warn('Calculating Stats');
            forEach(stats, (stat: StatVM) => {
                const { id, type, item, count} = stat;

                itemVMs[id] = {
                    id: item,
                    item: departments[item] ? departments[item].title : 'Unknown',
                    count,
                };
            });

            return Object.values(itemVMs);
        }
    );

    getPurposeVMs = createSelector(
        [() => referenceService.getAllReferences(ReferenceType.PURPOSE)],
        (purposes) => {
            let itemVMs: Record<string, ReferenceInfoVM> = {};

            forEachKVP(purposes, (itemKey: string, itemValue: ReferenceInfo) => {
                itemVMs[itemKey] = {
                    ...itemValue
                };
            })

            return itemVMs;
        }
    )

    getPurposeStatsVMs = createSelector(
        [() => statService.getStats(StatType.PURPOSE), this.getPurposeVMs],
        (stats, purposes) => {
            // let purposeVMs: ReferenceInfoVM = {};
            //
            // forEachKVP(purposes, (itemKey: string, itemValue: ReferenceInfo) => {
            //     purposeVMs[itemKey] = {
            //         ...itemValue
            //     };
            // })

            let itemVMs: Record<string, StatVM> = {};

            // itemVMs["0"] = {
            //     item: "Dummy",
            //     disabled: true,
            //     count: 1000,
            //     color: am4core.color("#dadada"),
            //     opacity: 0.3,
            //     strokeDasharray: "4,4"
            // };

            forEach(stats, (stat: StatVM) => {
                const { id, type, item, count} = stat;

                itemVMs[id] = {
                    id: item,
                    item: purposes[item] ? purposes[item].title : 'Unknown',
                    count,
                };
            });

            return Object.values(itemVMs);
        }
    );

    getDocTypeStatsVMs = createSelector(
        [() => statService.getStats(StatType.FILE_TYPE)],
        (stats) => {
            let itemVMs: Record<string, StatVM> = {};

            forEach(stats, (stat: StatVM) => {
                const { id, type, item, count} = stat;

                let value = item;
                switch (item.toLowerCase()) {
                    case "application/msword":
                        value = "doc";
                        break;
                    case "application/vnd.ms-word.document.macroEnabled.12":
                        value = "docm";
                        break;
                    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                        value = "docx";
                        break;
                    case "application/vnd.openxmlformats-officedocument.wordprocessingml.template":
                        value = "dotx";
                        break;
                    case "application/vnd.ms-word.template.macroEnabled.12":
                        value = "dotm";
                        break;
                    case "text/html":
                        value = "html";
                        break;
                    case "application/pdf":
                        value = "pdf";
                        break;
                    case "application/vnd.ms-powerpoint.template.macroEnabled.12":
                        value = "potm";
                        break;
                    case "application/vnd.openxmlformats-officedocument.presentationml.template":
                        value = "potx";
                        break;
                    case "application/vnd.ms-powerpoint.addin.macroEnabled.12":
                        value = "ppam";
                        break;
                    case "application/vnd.openxmlformats-officedocument.presentationml.slideshow":
                        value = "ppsx";
                        break;
                    case "application/vnd.ms-powerpoint.slideshow.macroEnabled.12":
                        value = "ppsm";
                        break;
                    case "application/vnd.ms-powerpoint":
                        value = "ppt";
                        break;
                    case "application/vnd.ms-powerpoint.presentation.macroEnabled.12":
                        value = "pptm";
                        break;
                    case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
                        value = "pptx";
                        break;
                    case "application/rtf":
                        value = "rtf";
                        break;
                    case "text/rtf":
                        value = "rtf2";
                        break;
                    case "text/plain":
                        value = "txt";
                        break;
                    case "text/csv":
                        value = "csv";
                        break;
                    case "application/csv":
                        value = "csv1";
                        break;
                    case "application/json":
                        value = "json";
                        break;
                    case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                        value = "xlsx";
                        break;
                    case "application/vnd.ms-excel.sheet.binary.macroEnabled.12":
                        value = "xlsb";
                        break;
                    case "application/vnd.ms-excel":
                        value = "xls";
                        break;
                    case "application/vnd.ms-excel.sheet.macroEnabled.12":
                        value = "xlsm";
                        break;
                    case "image/bmp":
                        value = "bmp";
                        break;
                    case "image/gif":
                        value = "gif";
                        break;
                    case "image/jpeg":
                        value = "jpg";
                        break;
                    case "image/png":
                        value = "png";
                        break;
                    case "multipart/form-data":
                        value = "file";
                        break;
                    default:
                        break;
                }

                itemVMs[id] = {
                    id,
                    item: value,
                    count,
                };
            });

            return Object.values(itemVMs);
        }
    );

    hasSearchResults = createSelector(
        [documentService.getSearchResults],
        (items) => {

            let length = 0;
            forEach(items, () => {
                length++;
            });

            return (length > 0);
        }
    );
}

export const {
    connectedPresenter: SearchGraphsPanelPresenter,
    componentId: SearchGraphsPanelId
} = createVisualConnector(SearchGraphsPanel);
