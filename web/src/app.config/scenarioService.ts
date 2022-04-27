import {ParamType, ReferenceType, SearchBannerMenuItem, SearchParamInfo, SortPropertyInfo} from "../app.model";
import {RepoItem} from "../framework.core/services";
import {nameOf, Nullable} from "../framework.core/extras/utils/typeUtils";
import {forEachKVP} from "../framework.core/extras/utils/collectionUtils";
import {getDateWithoutTime} from "../framework.core/extras/utils/timeUtils";
import {IStorage} from "../framework.core.api";
import {IScenarioService} from "../framework.core.api";
import {Plugin} from "../framework.core/extras/plugin";
import {MenuItem} from "../framework.core/model";
import {GraphSVG} from "../app.visual/theme/svgs/graphSVG";
import {SystemToolMenuItem} from "../app.model";
import {UploadSVG} from "../app.visual/theme/svgs/uploadSVG";
import {TagsSVG} from "../app.visual/theme/svgs/tagsSVG";
import {ProfileSVG} from "../app.visual/theme/svgs/profileSVG";
import {SearchResultsMenuItem} from "../app.model";
import {CardsSVG} from "../app.visual/theme/svgs/cardsSVG";
import {TableSVG} from "../app.visual/theme/svgs/tableSVG";
import {ListSVG} from "../app.visual/theme/svgs/listSVG";
import {PocketSVG} from "../app.visual/theme/svgs/pocketSVG";
import CardCollectionView from "../app.visual/components/searchResultsPanel/views/renderers/cardCollectionView";
import TableCollectionView from "../app.visual/components/searchResultsPanel/views/renderers/tableCollectionView";
import ListCollectionView from "../app.visual/components/searchResultsPanel/views/renderers/listCollectionView";
import {SearchSVG} from "../app.visual/theme/svgs/searchSVG";

export class ScenarioService extends Plugin implements IScenarioService {
    public static readonly class: string = 'ScenarioService';
    private dataAppStore: Nullable<IStorage> = null;

    public constructor() {
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
        this.createSearchParamInfo('author', ParamType.STRING, '', null, null, 'Author', true, true, false);
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
        this.createSearchParamInfo('user_search_request', ParamType.STRING, '', null, null, '', false, false, false);
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
        // this.createMenuItem(SearchBannerMenuItem, 'components/searchGraphsPanel', 'Graphs', false, GraphSVG);
    }

    createSystemTools() {
        this.createMenuItem(SystemToolMenuItem, 'app.visual/views/search', 'Search', false, SearchSVG);
        this.createMenuItem(SystemToolMenuItem, 'app.visual/components/uploadPanel', 'Upload', false, UploadSVG);
        this.createMenuItem(SystemToolMenuItem, 'app.visual/components/tagsPanel', 'Tags', false, TagsSVG);
        // this.createMenuItem(SystemToolMenuItem, 'components/statsPanel', 'Stats', false, StatsSVG);
        this.createMenuItem(SystemToolMenuItem, 'app.visual/components/profilePanel', 'Profile', false, ProfileSVG);
        this.createMenuItem(SystemToolMenuItem, 'app.visual/components/pocketsPanel', 'Pockets', false, PocketSVG);
        this.createMenuItem(SystemToolMenuItem, 'app.visual/components/searchGraphsPanel', 'Graphs', true, GraphSVG)
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
