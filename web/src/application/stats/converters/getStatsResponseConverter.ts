import {getValueOrDefault} from "../../../framework/extras/typeUtils";
import {StatInfo} from "../../../model";
import {forEachKVP} from "../../../framework.visual/extras/utils/collectionUtils";
import {makeGuid} from "../../../framework.visual/extras/utils/uniqueIdUtils";
import {StatType} from "../../../model";
import {Converter} from "../../common/converters/converter";

export class GetStatsResponseConverter extends Converter<any, any>{
    convert(fromData: any, reject: any): StatInfo[] {

        const result: StatInfo[] = [];

        if (Array.isArray(fromData)) {
            forEachKVP(fromData, (itemKey:string, itemValue: string[]) => {
                let statInfo: StatInfo = new StatInfo(makeGuid());

                let statType = -1;

                const value = getValueOrDefault(itemValue, 'class', '').toLowerCase();

                switch (value) {
                    case 'custom_shared_tag':
                        statType = StatType.CUSTOM_SHARED_TAG;
                        break;
                    case 'datastore_size':
                        statType = StatType.DATASTORE_SIZE;
                        break;
                    case 'department':
                        statType = StatType.DEPARTMENT;
                        break;
                    case 'file_type':
                        statType = StatType.FILE_TYPE;
                        break;
                    case 'project':
                        statType = StatType.PROJECT;
                        break;
                    case 'purpose':
                        statType = StatType.PURPOSE;
                        break;
                    case 'upload_date':
                        statType = StatType.UPLOAD_DATE;
                        break;
                    default:
                        console.log(`Stat type with title '${value}' not found`);
                        break;
                }

                statInfo.type = statType;
                statInfo.count = getValueOrDefault(itemValue, 'count', '');
                statInfo.item = getValueOrDefault(itemValue, 'item', '');

                result.push(statInfo);
            });
        }
        else {
            reject('Error while parsing array of stats. Expected Array. Received the following: <' + fromData + '>');
        }


        return result;
    }
}
