import {ReferenceType} from "../../app.model";
import {IPlugin} from "../../framework.core.api";
import {IEntityProvider} from "../../framework.core.api/iEntityProvider";
import {ReferenceInfo} from "../../app.model";

export interface IReferenceService extends IPlugin {
    getAllReferencesGroupedByType(): Record<ReferenceType, Record<string, ReferenceInfo>>;

    fetchReferences(referenceType: ReferenceType): void;

    getAllReferences(referenceType: ReferenceType): Record<string, ReferenceInfo>;

    setReferenceProvider(provider: IEntityProvider<ReferenceInfo>): void;
}
