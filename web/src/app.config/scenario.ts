import {MetadataInfo} from "../app";
import {RepoItem} from "../framework/services/repoService/repoItem";
import {repoService} from "../app.core/serviceComposition";

let result: Record<string, Record<string, RepoItem>> = {};

//
// let metadataInfo = new MetadataInfo('search-loading-info');
// metadataInfo.isLoading = false;
//
// repoService.addOrUpdateRepoItem(metadataInfo);
//
// export default {
//     [`${MetadataInfo.class}`]: {
//         ['search-loading-info']: {
//             id: 'search-loading-info',
//             isLoading: false
//         }
//     }
// };
