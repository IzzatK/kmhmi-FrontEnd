import {createSelector, OutputSelector} from "@reduxjs/toolkit";
import {forEach, forEachKVP, sortByProperty} from "../../framework.core/extras/utils/collectionUtils";
import {
    DocumentInfo, ExcerptMapper,
    MetadataInfo,
    MetadataType, NoteInfo,
    ParamType,
    PocketMapper, ReportInfo, ResourceMapper,
    SearchParamInfo,
    SortPropertyInfo, WocketInfo
} from "../../app.model";
import {Nullable} from "../../framework.core/extras/utils/typeUtils";

import {IDocumentService, IPocketService, IReportService, IUserService} from "../../app.core.api";
import {Plugin} from "../../framework.core/extras/plugin";
import {getDateWithoutTime} from "../../framework.core/extras/utils/timeUtils";
import {StatusType} from "../../app.model";
import {IEntityProvider} from "../../framework.core.api";
import {IRepoItem} from "../../framework.core/services";
import {SearchResultInfo} from "../../app.model/searchResultInfo";

export class DocumentService extends Plugin implements IDocumentService {
    public static readonly class:string = 'DocumentService';
    private userService: Nullable<IUserService> = null;
    private pocketService: Nullable<IPocketService> = null;
    private reportService: Nullable<IReportService> = null;
    private documentProvider?: Nullable<IEntityProvider<DocumentInfo>> = null;
    private searchResultsProvider?: Nullable<IEntityProvider<any>> = null;

    private readonly pendingFilesRaw: Record<string, any>;

    getAllDocumentsSelector: OutputSelector<any, Record<string, DocumentInfo>, (res1: Record<string, DocumentInfo>, res2: any) => Record<string, DocumentInfo>>;
    getPendingDocumentsSelector: OutputSelector<any, Record<string, DocumentInfo>, (res: Record<string, DocumentInfo>) => Record<string, DocumentInfo>>;
    getSearchDocumentsSelector: OutputSelector<any, Record<string, DocumentInfo>, (res: Record<string, DocumentInfo>) => Record<string, DocumentInfo>>;

    getSearchResultsSelector: OutputSelector<any, Record<string, SearchResultInfo>, (res1: Record<string, DocumentInfo>, res2: Record<string, PocketMapper>, res3: Record<string, ReportInfo>, res4: string | undefined) => Record<string, SearchResultInfo>>;

    getLocalPocketsSelector: OutputSelector<any, Record<string, PocketMapper>, (res1: Record<string, PocketMapper>, res2: string | undefined) => Record<string, PocketMapper>>;
    getLocalReportsSelector: OutputSelector<any, Record<string, ReportInfo>, (res1: Record<string, ReportInfo>, res2: string | undefined) => Record<string, ReportInfo>>;

    constructor() {
        super();
        this.appendClassName(DocumentService.class);

        this.pendingFilesRaw = {};

        this.getAllDocumentsSelector = createSelector(
            [(s) => this.getAll<DocumentInfo>(DocumentInfo.class), (s) => this.userService?.getCurrentUserId()],
            (documents, currentUserId) => {
                let result: Record<string, DocumentInfo> = {};

                if (documents) {
                    forEach(documents, (document: DocumentInfo) => {
                        if (document) {
                            let private_tag: any = [];
                            if (document.private_tag) {
                                forEach(document.private_tag, (item:{user_id:string, tag_id: string}) => {
                                    let user_id = item.user_id;
                                    if (user_id === currentUserId) {
                                        private_tag = item['tag_id'];
                                    }
                                })
                            }

                            let userDoc = document;
                            Object.assign(userDoc.private_tag, private_tag);

                            result[document.id] = userDoc;
                        }
                    });

                    return result;
                }
                return result;
            }
        );

        this.getSearchDocumentsSelector = createSelector(
            [(s) => this.getAllDocuments()],
            (items) => {
                let result:Record<string, DocumentInfo> = {};

                forEach(items, (item:DocumentInfo) => {
                    const { id, isPending } = item;

                    if (!isPending) {
                        result[id] = item;
                    }
                });

                return result;
            }
        );

        this.getSearchResultsSelector = createSelector(
            [
                (s) => this.getAllDocuments(),
                (s) => this.pocketService?.getPocketMappers(),
                (s) => this.reportService?.getReports(),
                (s) => this.userService?.getCurrentUserId()
            ],
            (documents, pocketMappers, reports, currentUserId) => {
                let result:Record<string, SearchResultInfo> = {};

                forEach(documents, (item: DocumentInfo) => {
                    const { id, isPending } = item;

                    console.log(JSON.stringify(item))

                    if (!isPending) {
                        result[id] = item;
                    }
                });

                forEach(pocketMappers, (item: PocketMapper) => {
                    const { id } = item;
                    const { scope, author_id } = item.pocket;

                    if (currentUserId !== author_id && scope !== "Draft") {
                        result[id] = item;
                    }
                })

                // forEach(reports, (item: ReportInfo) => {
                //     const { id, scope } = item;
                //
                //     if (scope !== "Draft") {
                //         result[id] = item;
                //     }
                // })

                let sortValue: string = this.getSearchParam("sort")?.value || "";

                result = sortByProperty(result, sortValue);

                return result;
            }
        );

        this.getPendingDocumentsSelector = createSelector(
            [(s) => this.getAllDocuments()],
            (items) => {
                let result: Record<string, DocumentInfo> = {};

                forEach(items, (item:DocumentInfo) => {
                    const { id, isPending } = item;

                    if (isPending) {
                        result[id] = item;
                    }
                })

                return result;
            }
        );

        this.getLocalPocketsSelector = createSelector(
            [(s) => this.pocketService?.getPocketMappers(), (s) => this.userService?.getCurrentUserId()],
            (pocketMappers, currentUserId) => {
                let result: Record<string, PocketMapper> = {};

                forEach(pocketMappers, (item: PocketMapper) => {
                    const { id } = item;
                    const { author_id } = item.pocket;

                    if (currentUserId && currentUserId === author_id) {
                        result[id] = item;
                    }
                })

                return result;
            }
        )

        this.getLocalReportsSelector = createSelector(
            [(s) => this.reportService?.getReports(), (s) => this.userService?.getCurrentUserId()],
            (reports, currentUserId) => {
                let result: Record<string, ReportInfo> = {};

                forEach(reports, (item: ReportInfo) => {
                    const { id, author_id } = item;

                    if (currentUserId && currentUserId === author_id) {
                        result[id] = item;
                    }
                })

                return result;
            }
        )
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

    setUserService(userService: IUserService) {
        this.userService = userService;
    }

    setPocketService(pocketService: IPocketService) {
        this.pocketService = pocketService;
    }

    setReportService(reportService: IReportService) {
        this.reportService = reportService;
    }

    getAllDocuments(): Record<string, DocumentInfo> {
        return this.getAllDocumentsSelector(super.getRepoState());
    }

    getSearchDocuments(): Record<string, DocumentInfo> {
        return this.getSearchDocumentsSelector(super.getRepoState());
    }

    getSearchResults(): Record<string, SearchResultInfo> {
        return this.getSearchResultsSelector(super.getRepoState());
    }

    getPendingDocuments(): Record<string, DocumentInfo> {
        return this.getPendingDocumentsSelector(super.getRepoState());
    }

    private getLocalReports(): Record<string, ReportInfo> {
        return this.getLocalReportsSelector(super.getRepoState());
    }

    private getLocalPockets(): Record<string, PocketMapper> {
        return this.getLocalPocketsSelector(super.getRepoState());
    }

    fetchDocument(id: string) {
        this.documentProvider?.getSingle(id)
            .then((document) => {
                if (document) {
                    const { id, status } = document;

                    if (status !== StatusType.ERROR) {
                        let localDocument: Nullable<DocumentInfo> = this.getDocument(id);

                        if (localDocument) {
                            document.isPending = localDocument.isPending;
                        }

                        this.addOrUpdateRepoItem<DocumentInfo>(document);
                    }
                }

            })
            .catch(error => {
                console.log(error);
            });
    }

    clearSearch() {
        this.clearDirtyFlags();
        this.clearAllParams();

        this.setGetDocumentArrayMetadata(false)

        let documents = Object.assign({}, this.getPendingDocuments());

        this.removeAllByType(DocumentInfo.class);

        this.addOrUpdateAllRepoItems(<DocumentInfo[]>Object.values(documents));
    }

    fetchSearchResults() {
        this.setGetDocumentArrayMetadata(true);

        this.searchResultsProvider?.getAll(this.getSearchParams())
            .then(responseData => {

                const items: IRepoItem[] = [];

                forEach(responseData, (searchResult: SearchResultInfo) => {
                    if (searchResult instanceof PocketMapper) {
                        const flattenedItems = this.flattenPocketMapper(searchResult);
                        items.push(...flattenedItems);
                    } else {
                        items.push(searchResult);
                    }
                })

                const privatePocketMappers = this.getLocalPockets();

                forEach(privatePocketMappers, (pocketMapper: PocketMapper) => {
                    const flattenedItems = this.flattenPocketMapper(pocketMapper);
                    items.push(...flattenedItems);
                })

                let searchResults: Record<string, SearchResultInfo> = Object.assign({}, this.getPendingDocuments(), this.getLocalReports(), items);

                this.setGetDocumentArrayMetadata(false)

                let values: any[] = Object.values(searchResults) as unknown as any[];
                if (values && values.length === 0) {
                    this.setGetDocumentArrayMetadata(false, 'No Results')
                }

                this.removeAllByType(DocumentInfo.class);
                this.removeAllByType(WocketInfo.class);
                this.addOrUpdateAllRepoItems(values);

            })
            .catch(error => {
                console.log(error);
                this.setGetDocumentArrayMetadata(false,
                    `${error}\n\nSearch Data: \n\n${JSON.stringify(error)}`)
            });
    }

    fetchDocuments() {
        this.setGetDocumentArrayMetadata(true);

        this.documentProvider?.getAll(this.getSearchParams())
            .then(responseData => {

                let documents: Record<string, DocumentInfo> = Object.assign({}, this.getPendingDocuments(), responseData);

                this.setGetDocumentArrayMetadata(false)

                let values: DocumentInfo[] = Object.values(documents) as unknown as DocumentInfo[];
                if (values && values.length === 0) {
                    this.setGetDocumentArrayMetadata(false, 'No Results')
                }

                this.removeAllByType(DocumentInfo.class);
                this.addOrUpdateAllRepoItems(values);

            })
            .catch(error => {
                console.log(error);
                this.setGetDocumentArrayMetadata(false,
                    `${error}\n\nSearch Data: \n\n${JSON.stringify(error)}`)
            });
    }

    fetchUploadedDocuments() {
        const user_id = this.userService?.getCurrentUserId();

        if (user_id) {
            const searchParams = {
                uploaded_documents_only: true,
                user_id
            }

            this.documentProvider?.getAll(searchParams)
                .then(responseData => {
                    let documents: Record<string, DocumentInfo> = Object.assign({}, this.getSearchDocuments(), responseData);

                    let values: DocumentInfo[] = Object.values(documents) as unknown as DocumentInfo[];

                    this.removeAllByType(DocumentInfo.class);
                    this.addOrUpdateAllRepoItems(values);
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }

    updateDocument(modifiedDocument: any) {
        const { id } = modifiedDocument;

        // tell the ui we are going to be updating
        let document = this.getDocument(id);

        if (document) {
            const { private_tag:original_private_tag, title, scope, department } = document;

            if (modifiedDocument.hasOwnProperty('private_tag')) {
                let total_private_tag: Record<string, Record<string, string>> = {};

                let currentUserId = this.userService?.getCurrentUserId();

                if (original_private_tag) {
                    forEachKVP(original_private_tag, (itemKey: string, itemValue: Record<string, string>) => {
                        if (itemKey !== currentUserId) {
                            total_private_tag[itemKey] = itemValue;
                        }
                    })
                }

                if (currentUserId) {
                    total_private_tag[currentUserId] = modifiedDocument['private_tag'];
                }

                modifiedDocument = {
                    ...modifiedDocument,
                    private_tag: total_private_tag,
                }
            }

            //populate required fields
            if (!modifiedDocument['title']) {
                modifiedDocument = {
                    ...modifiedDocument,
                    title,
                }
            }

            if (!modifiedDocument['scope']) {
                modifiedDocument = {
                    ...modifiedDocument,
                    scope,
                }
            }

            if (!modifiedDocument['department']) {
                modifiedDocument = {
                    ...modifiedDocument,
                    department,
                }
            }
        }

        let mergedDocumentInfo = {
            ...modifiedDocument,
            isUpdating: true
        }

        this.addOrUpdateRepoItem(mergedDocumentInfo)

        // get the latest from the server
        this.documentProvider?.update(id, {id, modifiedDocument: mergedDocumentInfo})
            .then(document => {
                if (document != null) {
                    this.addOrUpdateRepoItem(document);

                    const { file_name } = document;

                    if (this.getDocument(file_name) != null) {
                        this.removeAllById(DocumentInfo.class, file_name);
                    }
                }
            })
            .catch(error => {
                console.log(error);
            });
    }

    removeDocument(id: string) {
        let document = this.getDocument(id);
        if (document) {
            const { file_name } = document;
            this.removeAllById(DocumentInfo.class, file_name);
        }

        this.documentProvider?.remove(id)
            .then(document => {
                if (document != null) {
                    this.removeRepoItem(document)
                }
            })
            .catch(error => {
                console.log(error);
            });
    }

    startUpload(fileList: any) {
        const user_id = this.userService?.getCurrentUserId();

        forEach(fileList, (file: any) => {
            if (file) {
                const {name} = file;

                // since we are posting and don't have an id yet, use a placeholder
                let tmpId = name;

                // redux raw file
                this.pendingFilesRaw[tmpId] = file;

                // put the file in the pending documents list
                // id will be auto generated client side
                let tmpFileInfo = new DocumentInfo(tmpId);
                tmpFileInfo.file_name = name;
                tmpFileInfo.isPending = true;
                tmpFileInfo.status = StatusType.PROCESSING;
                this.addOrUpdateRepoItem(tmpFileInfo);

                let requestData = {
                    id: tmpId,
                    pendingFilesRaw: this.pendingFilesRaw,
                    file,
                    user_id,
                };


                this.documentProvider?.create(requestData,
                    (updatedDocument) => {
                        const {id, status} = updatedDocument;

                        updatedDocument.file_name = name;
                        updatedDocument.isPending = true;

                        if (this.pendingFilesRaw[tmpId]) {
                            delete this.pendingFilesRaw[tmpId];

                            // put the document back in with the new id
                            this.pendingFilesRaw[id] = file;
                        } else if (status === StatusType.FAILED) {
                            setTimeout(() => {
                                this.removeAllById(DocumentInfo.class, id);
                                this.removeAllById(DocumentInfo.class, name);
                            }, 5000);
                        }

                        this.addOrUpdateRepoItem(updatedDocument);
                    })
                    .then(document => {
                        if (document != null) {
                            const { id, file_name } = document;

                            let localFile = this.getDocument(file_name);

                            if (localFile) {
                                if (localFile.isDeleted) {
                                    this.removeDocument(id);
                                } else {
                                    this.addOrUpdateRepoItem(document);
                                }
                            } else {
                                this.removeDocument(id);
                            }
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    })
            }
        });
    }

    cancelUpload(id: string) {
        let pendingFile = this.getDocument(id);

        if (pendingFile) {
            const { file_name } = pendingFile;

            let rawFile: any;

            // delete raw file
            if (this.pendingFilesRaw[id]) {
                rawFile = this.pendingFilesRaw[id];
                delete this.pendingFilesRaw[id];
            } else if (this.pendingFilesRaw[file_name]) {
                rawFile = this.pendingFilesRaw[file_name];
                delete this.pendingFilesRaw[file_name];
            }

            if (rawFile) {
                let cancelledFile = {
                    ...pendingFile,
                    isPending: true,
                    isDeleted: true,
                    status: StatusType.CANCELLED,
                }

                this.addOrUpdateRepoItem(cancelledFile);

                setTimeout(() => {
                    this.removeAllById(DocumentInfo.class, id);
                    this.removeAllById(DocumentInfo.class, file_name);
                }, 3000);

            } else {
                this.documentProvider?.remove(id)
                    .then(document => {
                        if (document != null) {
                            let approvedFile = {
                                ...document,
                                isPending: true,
                                isDeleted: true,
                                status: StatusType.CANCELLED,
                            }
                            this.addOrUpdateRepoItem(approvedFile);

                            let { file_name } = document;

                            setTimeout(() => {
                                this.removeAllById(DocumentInfo.class, id);
                                this.removeAllById(DocumentInfo.class, file_name);
                            }, 3000);
                        }
                    })
                    .catch(error => {
                        this.error(error);
                    });
            }
        }
    }

    clearDocuments() {
        this.removeAllByType(DocumentInfo.class);
    }

    getDocument(id: string): Nullable<DocumentInfo> {
        return super.getRepoItem<DocumentInfo>(DocumentInfo.class, id);
    }

    approvePendingFile(id: string) {
        let pendingFile = this.getDocument(id);

        if (pendingFile) {
            let { file_name } = pendingFile;
            this.removeAllById(DocumentInfo.class, file_name);

            let approvedFile = {
                ...pendingFile,
                isPending: false,
            }
            this.addOrUpdateRepoItem(approvedFile);
        }
    }

    removePendingFile(id: string) {
        // delete raw file
        if (this.pendingFilesRaw[id]) {
            delete this.pendingFilesRaw[id];
        }

        this.documentProvider?.remove(id)
            .then(document => {
                if (document != null) {
                    let approvedFile = {
                        ...document,
                        isPending: true,
                        isDeleted: true,
                    }
                    this.addOrUpdateRepoItem(approvedFile);

                    let { file_name } = document;

                    this.removeAllById(DocumentInfo.class, id);
                    setTimeout(() => {
                        this.removeAllById(DocumentInfo.class, file_name);
                    }, 3000)
                }
            })
            .catch(error => {
                this.error(error);
            });
    }

    setGetDocumentArrayMetadata(isLoading: boolean, errorMessage?: string) {
        let repoItem: Nullable<MetadataInfo> = super.getRepoItem(MetadataInfo.class, MetadataType.DOCUMENTS_GET_ARRAY);

        if (repoItem == null) {
            repoItem = new MetadataInfo(MetadataType.DOCUMENTS_GET_ARRAY);
        }

        repoItem.isLoading = isLoading;

        if (errorMessage) {
            repoItem.hasError = true;
            repoItem.errorMessage = errorMessage;
        }
        else {
            repoItem.hasError = false;
            repoItem.errorMessage = '';
        }

        this.addOrUpdateRepoItem(repoItem);
    }

    setDocumentProvider(provider: IEntityProvider<DocumentInfo>): void {
        this.documentProvider = provider;
    }

    setSearchResultsProvider(provider: IEntityProvider<any>): void {
        this.searchResultsProvider = provider;
    }

    clearAllParams() {
        let items = this.getSearchParams();

        let nextItems: any = {};

        forEach(items, (searchInfo: { id: string; type: ParamType; }) => {

            let next: SearchParamInfo = new SearchParamInfo(searchInfo.id);
            next = Object.assign(next, searchInfo);

            if (searchInfo.type === ParamType.DATE_RANGE) {
                next.value = {
                    start_date: getDateWithoutTime(new Date()),
                    end_date: getDateWithoutTime(new Date())
                }
            } else {
                next.value = '';
            }

            nextItems[searchInfo.id] = next;
        });

        this.addOrUpdateAllRepoItems((<any>Object).values(nextItems));
    }

    getSearchParams() {
        return super.getAll<SearchParamInfo>(SearchParamInfo.class);
    }

    getSearchParam(id: string): Nullable<SearchParamInfo> {
        return super.getRepoItem(SearchParamInfo.class, id);
    }

    clearDirtyFlags() {
        let items = this.getSearchParams();

        let nextParams: any = {};

        forEach(items, (item: { id: string | number; }) => {
            let nextParam: any = Object.assign({}, item);
            nextParam.dirty = false;

            nextParams[item.id] = nextParam;
        });

        this.addOrUpdateAllRepoItems((<any>Object).values(nextParams));
    }

    setSearchText(value: string) {
        let repoItem = super.getRepoItem(SearchParamInfo.class, 'search_request');

        if (repoItem != null) {
            let next = Object.assign(new SearchParamInfo('search_request'), repoItem);
            next.value = value;
            this.addOrUpdateRepoItem(next);
        }
    }

    setSearchParam(id: string, value: string | string[]) {
        let repoItem = super.getRepoItem(SearchParamInfo.class, id);

        if (repoItem != null) {
            let next = Object.assign(new SearchParamInfo(id), repoItem);
            next.value = value;
            next.dirty = value !== "";
            this.addOrUpdateRepoItem(next)
        }

        // now perform a new search
        this.fetchSearchResults();
    }

    setVisibility(id: string, visible: boolean) {
        let repoItem = super.getRepoItem(SearchParamInfo.class, id);

        if (repoItem != null) {
            let next = Object.assign(new SearchParamInfo(id), repoItem);
            next.visible = visible;
            this.addOrUpdateRepoItem(next);
        }
    }

    getSearchText() {
        let result = '';

        let repoItem: any = super.getRepoItem(SearchParamInfo.class, 'search_request');
        if (repoItem != null) {
            result = repoItem.value;
        }

        return result;
    }

    setSortParam(value: string) {
        let repoItem = super.getRepoItem(SearchParamInfo.class, 'sort');
        if (repoItem != null) {
            let next = Object.assign(new SearchParamInfo(repoItem.id), repoItem);
            next.value = value;

            this.addOrUpdateRepoItem(next);
        }
    }

    getActiveSortId() {
        let result = null;

        let repoItem: any = super.getRepoItem(SearchParamInfo.class, 'sort');
        if (repoItem != null) {
            result = repoItem.value;
        }

        return result;
    }

    getSortTypes() {
        return super.getAll<SortPropertyInfo>(SortPropertyInfo.class);
    }

    private flattenPocketMapper(pocketMapper: PocketMapper) {
        const result = [];

        result.push(pocketMapper.pocket);

        forEach(pocketMapper.resourceMappers, (resourceMapper: ResourceMapper) => {
            result.push(resourceMapper.resource);

            forEach(resourceMapper.excerptMappers, (excerptMapper: ExcerptMapper) => {
                result.push(excerptMapper.excerpt);

                forEach(excerptMapper.notes, (note: NoteInfo) => {
                    if (note) {
                        result.push(note);
                    }
                });
            });
        });

        return result;
    }
}
