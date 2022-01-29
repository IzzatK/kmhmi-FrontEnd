import {createSelector, Selector} from "@reduxjs/toolkit";
import {forEach,} from "../../framework.visual/extras/utils/collectionUtils";
import {MetadataInfo, MetadataType, ReferenceInfo, ReferenceType} from "../../app.model";
import {IEntityProvider, IReferenceService} from "../../app.core.api";
import {Plugin} from "../../framework/extras/plugin";
import {Nullable} from "../../framework/extras/typeUtils";

export class ReferenceService extends Plugin implements IReferenceService {
    public static readonly class: string = 'ReferenceService';

    private readonly getAllReferenceSelectors!: Record<string, Selector<any, Record<string, ReferenceInfo>>>;
    private readonly getAllReferencesGroupedByTypeSelector: Selector<any, Record<ReferenceType, Record<string, ReferenceInfo>>>;
    private referenceProvider: Nullable<IEntityProvider<ReferenceInfo>> = null;

    constructor() {
        super();
        this.appendClassName(ReferenceService.class);

        this.getAllReferenceSelectors = {};


        this.getAllReferencesGroupedByTypeSelector = createSelector(
            [() => this.getAll<ReferenceInfo>(ReferenceInfo.class)],
            (references) => {
                let result: Record<string, Record<string, ReferenceInfo>> = {};

                if (references) {
                    forEach(references, (reference: ReferenceInfo) => {

                        if (!result[reference.type]) {
                            result[reference.type] = {};
                        }

                        result[reference.type][reference.id] = reference;
                    });
                }
                return result;
            }
        );
    }

    getAllReferencesGroupedByType(): Record<ReferenceType, Record<string, ReferenceInfo>> {
        return this.getAllReferencesGroupedByTypeSelector(super.getRepoState());
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

    fetchReferences(referenceType: ReferenceType) {
        this.setReferencesLoading(true)

        let referenceOrdinal = ReferenceType[referenceType];

        this.referenceProvider?.getAll({id: referenceOrdinal})
            .then(responseData => {
                this.addOrUpdateAllRepoItems(responseData)
                this.setReferencesLoading(false)
            })
            .catch(error => {
                console.log(error);
                this.setReferencesLoading(false)
            });
    }

    getAllReferences(referenceType: ReferenceType) {
        let selector = this.getAllReferenceSelectors[referenceType];

        if (!selector) {
            selector = createSelector(
                [() => this.getAll<ReferenceInfo>(ReferenceInfo.class)],
                (references) => {
                    let result: any = {};

                    if (references) {
                        forEach(references, (reference: { type: ReferenceType; id: string; }) => {
                            if (reference.type === referenceType) {
                                result[reference.id] = reference;
                            }
                        });
                    }
                    return result;
                }
            );
            this.getAllReferenceSelectors[referenceType] = selector;
        }

        return selector(super.getRepoState());
    }

    setReferencesLoading(isLoading: boolean) {
        let next = super.getRepoItem<MetadataInfo>(MetadataInfo.class, MetadataType.REFERENCE_GET_SINGLE);
        if (!next) {
            next = new MetadataInfo(MetadataType.REFERENCE_GET_SINGLE);
        }
        next.isLoading = isLoading;

        this.addOrUpdateRepoItem(next);
    }

    setReferenceProvider(provider: IEntityProvider<ReferenceInfo>): void {
        this.referenceProvider = provider;
    }
}
