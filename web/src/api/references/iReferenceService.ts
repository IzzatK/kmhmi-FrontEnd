import {ReferenceType} from "../../model";
import {IPlugin} from "../../framework/api";
import {IEntityProvider} from "../common/iEntityProvider";
import {ReferenceInfo} from "../../model";

export interface IReferenceService extends IPlugin {
    getAllReferencesGroupedByType(): Record<ReferenceType, Record<string, ReferenceInfo>>;

    fetchReferences(referenceType: ReferenceType): void;

    getAllReferences(referenceType: ReferenceType): Record<string, ReferenceInfo>;

    setReferenceProvider(provider: IEntityProvider<ReferenceInfo>): void;
}
