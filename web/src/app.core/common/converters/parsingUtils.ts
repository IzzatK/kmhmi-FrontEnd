import {ReferenceInfo} from "../../../app.model";
import {forEachKVP} from "../../../framework.core/extras/utils/collectionUtils";
import {repoService} from "../../../serviceComposition";
import {Nullable} from "../../../framework.core/extras/utils/typeUtils";

export const parseServerReferenceValueOrDefault = (object: any, propertyName: string, defaultValue: any) => {
    let result = defaultValue;

    let title = object[propertyName];
    if (title) {
        let titleUpper = title.toUpperCase();

        let referenceInfo: Nullable<ReferenceInfo> = null;

        let items = repoService.getAll(ReferenceInfo.class);
        forEachKVP(items, (itemKey: string, itemValue: ReferenceInfo) => {
            if (itemValue.title.toUpperCase() === titleUpper) {
                referenceInfo = itemValue;
                result = referenceInfo.id;
                return true;
            }
        })

        if (!referenceInfo) {
            let referenceInfos = repoService.getAll<ReferenceInfo>(ReferenceInfo.class);
            console.log(`Reference type with title '${titleUpper}' not found in ${JSON.stringify(referenceInfos)}`)
        }

    }
    else {
        console.log(`No ${propertyName} has been assigned for object ${JSON.stringify(object)}`)
    }

    return result;
}

export const parseClientReferenceValueOrDefault = (state: any, modifiedDocument:any, latestDocument:any, propertyName: string, defaultValue: any) => {
    let result = defaultValue;

    let value: string = modifiedDocument[propertyName] ? modifiedDocument[propertyName] : latestDocument[propertyName]

    if (value) {
        let repoItem: Nullable<ReferenceInfo> = repoService.getSingle(ReferenceInfo.class, modifiedDocument[propertyName]);
        if (repoItem) {
            result = repoItem.title;
        }
    }

    return result;
}

export const parseClientTagValueOrDefault = (state: any, modifiedDocument:any, latestDocument:any, propertyName: string, defaultValue: any) => {
    let result = defaultValue;

    if (modifiedDocument[propertyName]) {
        let repoItem: Nullable<ReferenceInfo> = repoService.getSingle(ReferenceInfo.class, modifiedDocument[propertyName]);
        if (repoItem) {
            result = repoItem.title;
        }
    }
    else if (latestDocument[propertyName]) {
        result = latestDocument[propertyName]
    }

    return result;
}
