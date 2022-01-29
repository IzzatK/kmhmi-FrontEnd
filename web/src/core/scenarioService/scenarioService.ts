import {SearchBannerMenuItem, SearchParamInfo} from "../../model";
import {RepoItem} from "../../framework/services/repoService/repoItem";
import {nameOf, Nullable} from "../../framework/extras/typeUtils";
import {ParamType} from "../../model";
import {forEachKVP} from "../../framework.visual/extras/utils/collectionUtils";
import {ReferenceType} from "../../model";
import {getDateWithoutTime} from "../../framework.visual/extras/utils/timeUtils";
import {SortPropertyInfo} from "../../model";
import {IStorage} from "../../framework.api";
import {IScenarioService} from "../../core.api";
import {Plugin} from "../../framework/extras/plugin";
import {MenuItem} from "../../framework/model/menuItem";
import {GraphSVG} from "../../visual/theme/svgs/graphSVG";
import {SystemToolMenuItem} from "../../visual/model/systemToolMenuItem";
import {UploadSVG} from "../../visual/theme/svgs/uploadSVG";
import {TagsSVG} from "../../visual/theme/svgs/tagsSVG";
import {StatsSVG} from "../../visual/theme/svgs/statsSVG";
import {ProfileSVG} from "../../visual/theme/svgs/profileSVG";
import {SearchResultsMenuItem} from "../../visual/model/searchResultsMenuItem";
import {CardsSVG} from "../../visual/theme/svgs/cardsSVG";
import {TableSVG} from "../../visual/theme/svgs/tableSVG";
import {ListSVG} from "../../visual/theme/svgs/listSVG";
import CardCollectionView from "../../visual/components/searchResultsPanel/renderers/cardCollectionView";
import TableCollectionView from "../../visual/components/searchResultsPanel/renderers/tableCollectionView";
import ListCollectionView from "../../visual/components/searchResultsPanel/renderers/listCollectionView";

export class ScenarioService extends Plugin implements IScenarioService {
    public static readonly class: string = 'ScenarioService';
    private dataAppStore: Nullable<IStorage> = null;

    constructor() {
        super();
        this.appendClassName(ScenarioService.class);
    }

    start() {
        super.start();

        this.runScenario();
    }

    stop() {
        super.stop();
    }

    configure() {
        super.configure();
    }

    setDataAppStore(dataStore: IStorage) {
        this.dataAppStore = dataStore;
    }

    createScenarioItem<T extends RepoItem>(id: string, ctor: {new(id: string): T}, args: Record<string, any>) {
        const repoItem = new ctor(id);

        const dictionary: Record<string, any> = repoItem;

        forEachKVP(args, (key: string, value: any) => {
            if (key in repoItem) {
                dictionary[key] = value;
            }
        });

        this.addOrUpdateRepoItem(repoItem);
    }

    createSearchParamInfo(id: string, type: ParamType, value: any, options: any, optionsId: Nullable<string>, title: string, visible: boolean, advanced: boolean, dirty: boolean) {
        this.createScenarioItem(id, SearchParamInfo, {
            [nameOf<SearchParamInfo>('type')]: type,
            [nameOf<SearchParamInfo>('value')]: value,
            [nameOf<SearchParamInfo>('options')]: options,
            [nameOf<SearchParamInfo>('optionsId')]: optionsId,
            [nameOf<SearchParamInfo>('title')]: title,
            [nameOf<SearchParamInfo>('visible')]: visible,
            [nameOf<SearchParamInfo>('advanced')]: advanced,
            [nameOf<SearchParamInfo>('dirty')]: dirty,
        })
    }

    createMenuItem<T extends MenuItem>(ctor: {new(id: string): T}, id:string, title: string, selected: boolean, graphic: any, context: any = null) {
        this.createScenarioItem(id, ctor, {
            [nameOf<T>('title')]: title,
            [nameOf<T>('selected')]: selected,
            [nameOf<T>('graphic')]: graphic,
            [nameOf<T>('context')]: context
        })
    }

    createSortPropertyInfo(id: string, title: string, value: string) {
        this.createScenarioItem(id, SortPropertyInfo, {
            [nameOf<SearchParamInfo>('title')]: title,
            [nameOf<SearchParamInfo>('value')]: value,
        })
    }

    createSearchParamsInfos() {
        this.createSearchParamInfo('search_request', ParamType.STRING, '', null, null, 'Include Text', false, false, false);
        this.createSearchParamInfo('exclude_search_request', ParamType.STRING, '', null, null, 'Exclude Text', true, true, false);
        this.createSearchParamInfo('sort', ParamType.OPTIONS, 'author_ascending', null, null, 'Sort', false, false, false);
        this.createSearchParamInfo('offset', ParamType.STRING, '', null, null, 'Offset', false, false, false);
        this.createSearchParamInfo('limit', ParamType.STRING, '', null, null, 'Limit', false, false, false);
        this.createSearchParamInfo('title', ParamType.STRING, '', null, null, 'Title', true, true, false);
        this.createSearchParamInfo('author', ParamType.STRING, '', null, null, 'Title', true, true, false);
        this.createSearchParamInfo('department', ParamType.OPTIONS, '', {}, ReferenceType.DEPARTMENT, 'Department', true, false, false);
        this.createSearchParamInfo('purpose', ParamType.OPTIONS, '', {}, ReferenceType.PURPOSE, 'Purpose', true, false, false);
        this.createSearchParamInfo('projects', ParamType.STRING, '', null, null, 'Projects', true, true, false);
        this.createSearchParamInfo('tags', ParamType.STRING, '', null, null, 'Tags', true, false, false);
        this.createSearchParamInfo('upload_date', ParamType.DATE_RANGE,
            {
                start_date: getDateWithoutTime(new Date()),
                end_date: getDateWithoutTime(new Date())
            },
            null, null, 'Upload Date', true, true, false);

        this.createSearchParamInfo('publication_date', ParamType.DATE_RANGE,
            {
                start_date: getDateWithoutTime(new Date()),
                end_date: getDateWithoutTime(new Date())
            },
            null, null, 'Publication Date', true, true, false);
    }

    createSortPropertyInfos() {
        this.createSortPropertyInfo('author_ascending', 'Author Ascending', 'author_ascending');
        this.createSortPropertyInfo('author_descending', 'Author Descending', '-author_descending');
        this.createSortPropertyInfo('title_ascending', 'Title Ascending', 'title_ascending');
        this.createSortPropertyInfo('title_descending', 'Title Descending', '-title_descending');
        this.createSortPropertyInfo('publication_date_ascending', 'Publication Date Ascending', 'publication_date_ascending');
        this.createSortPropertyInfo('publication_date_descending', 'Publication Date Descending', '-publication_date_descending');
        this.createSortPropertyInfo('upload_date_ascending', 'Upload Date Ascending', 'upload_date_ascending');
        this.createSortPropertyInfo('upload_date_descending', 'Upload Date Descending', '-upload_date_descending');
    }

    createSearchBannerTools() {
        this.createMenuItem(SearchBannerMenuItem, 'components/searchGraphsPanel', 'Graphs', false, GraphSVG);
    }

    createSystemTools() {
        this.createMenuItem(SystemToolMenuItem, 'components/uploadPanel', 'Upload', false, UploadSVG);
        this.createMenuItem(SystemToolMenuItem, 'components/tagsPanel', 'Tags', false, TagsSVG);
        // this.createMenuItem(SystemToolMenuItem, 'components/statsPanel', 'Stats', false, StatsSVG);
        this.createMenuItem(SystemToolMenuItem, 'components/profilePanel', 'Profile', false, ProfileSVG);
    }

    createSearchResultsTools() {
        this.createMenuItem(SearchResultsMenuItem, 'cardViewId', 'Card', false, CardsSVG, CardCollectionView);
        this.createMenuItem(SearchResultsMenuItem, 'tableViewId', 'Table', false, TableSVG, TableCollectionView);
        this.createMenuItem(SearchResultsMenuItem, 'listViewId', 'List', false, ListSVG, ListCollectionView);
    }

    runScenario() {
        this.createSearchParamsInfos();
        this.createSortPropertyInfos();
        this.createSearchBannerTools();
        this.createSystemTools();
        this.createSearchResultsTools()
    }
}
