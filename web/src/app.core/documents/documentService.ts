import {createSelector, OutputSelector} from "@reduxjs/toolkit";
import {forEach, forEachKVP} from "../../framework.visual/extras/utils/collectionUtils";
import {DocumentInfo, MetadataInfo, MetadataType, ParamType, SearchParamInfo, SortPropertyInfo} from "../../app.model";
import {Nullable} from "../../framework/extras/typeUtils";

import {IDocumentService, IEntityProvider, IUserService} from "../../app.core.api";
import {Plugin} from "../../framework/extras/plugin";
import {getDateWithoutTime} from "../../framework.visual/extras/utils/timeUtils";
import {StatusType} from "../../app.model/statusType";

export class DocumentService extends Plugin implements IDocumentService {
    public static readonly class:string = 'DocumentService';
    private userService: Nullable<IUserService> = null;
    private documentProvider?: Nullable<IEntityProvider<DocumentInfo>> = null;

    private readonly pendingFilesRaw: Record<string, any>;

    private pendingFilesQueue: any[];

    getAllDocumentsSelector: OutputSelector<unknown, Record<string, DocumentInfo>, (res1: Record<string, DocumentInfo>, res2: any) => Record<string, DocumentInfo>>;
    getSearchDocumentsSelector: OutputSelector<unknown, Record<string, DocumentInfo>, (res: Record<string, DocumentInfo>) => Record<string, DocumentInfo>>;
    getPendingDocumentsSelector: OutputSelector<unknown, Record<string, DocumentInfo>, (res: Record<string, DocumentInfo>) => Record<string, DocumentInfo>>;

    constructor() {
        super();
        this.appendClassName(DocumentService.class);

        this.pendingFilesRaw = {};

        this.pendingFilesQueue = [];

        this.getAllDocumentsSelector = createSelector(
            [() => this.getAll<DocumentInfo>(DocumentInfo.class), () => this.userService?.getCurrentUserId()],
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
            [this.getAllDocuments],
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

        this.getPendingDocumentsSelector = createSelector(
            [this.getAllDocuments],
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

    getAllDocuments(): Record<string, DocumentInfo> {
        return this.getAllDocumentsSelector(super.getRepoState());
    }

    getSearchDocuments(): Record<string, DocumentInfo> {
        return this.getSearchDocumentsSelector(super.getRepoState());
    }

    getPendingDocuments(): Record<string, DocumentInfo> {
        return this.getPendingDocumentsSelector(super.getRepoState());
    }

    fetchDocument(id: string) {
        this.documentProvider?.getSingle(id)
            .then(document => {
                if (document != null) {
                    const { id, status } = document;

                    if (status !== StatusType.ERROR) {
                        let localDocument = this.getDocument(id);

                        let nextDocument = {
                            ...localDocument,
                            ...document,
                            isPending: localDocument?.isPending ? localDocument.isPending : document.isPending
                        }

                        this.addOrUpdateRepoItem(nextDocument);
                    }
                }

            })
            .catch(error => {
                console.log(error);
            });
    }

    clearSearch() {
        this.clearAllParams()

        this.setGetDocumentArrayMetadata(false)

        let documents = Object.assign({}, this.getPendingDocuments());

        this.removeAllByType(DocumentInfo.class);

        this.addOrUpdateAllRepoItems(<DocumentInfo[]>Object.values(documents));
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
                this.clearDirtyFlags();

            })
            .catch(error => {
                console.log(error);
                this.setGetDocumentArrayMetadata(false,
                    `${error}\n\nSearch Data: \n\n${JSON.stringify(error)}`)
            });
    }

    updateDocument(modifiedDocument: any) {
        const {id} = modifiedDocument;

        // tell the ui we are going to be updating
        let document = this.getDocument(id);

        if (modifiedDocument.hasOwnProperty('private_tag')) {
            let total_private_tag: Record<string, Record<string, string>> = {};

            let currentUserId = this.userService?.getCurrentUserId();

            if (document) {
                const { private_tag:original_private_tag } = document;

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
                    private_tag: total_private_tag
                }
            }
        }

        let mergedDocumentInfo = {
            ...document,
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

    private enqueueFile(file: any) {
        const {name} = file;

        // since we are posting and don't have an id yet, use a placeholder
        let tmpId = name;

        this.pendingFilesQueue.push(file);

        // redux raw file
        this.pendingFilesRaw[tmpId] = file;

        // put the file in the pending documents list
        // id will be auto generated client side
        let tmpFileInfo = new DocumentInfo(tmpId);
        tmpFileInfo.file_name = name;
        tmpFileInfo.isPending = true;

        this.addOrUpdateRepoItem(tmpFileInfo)
    }

    dequeueFile() {
        const file = this.pendingFilesQueue.shift();

        if (file) {
            const {name} = file;

            // since we are posting and don't have an id yet, use a placeholder
            let tmpId = name;

            // redux raw file
            this.pendingFilesRaw[tmpId] = file;

            let requestData = {
                id: tmpId,
                pendingFilesRaw: this.pendingFilesRaw,
                file
            };

            let document = this.getDocument(tmpId);
            if (document) {
                document.status = StatusType.PROCESSING;
                this.addOrUpdateRepoItem(document);
            }

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

                    this.processQueue();

                })
                .catch(error => {
                    console.log(error);
                    this.processQueue();
                })
        }
    }

    processQueue() {
        if (this.pendingFilesQueue.length !== 0) {
            this.dequeueFile();
        }
    }

    startUpload(fileList: any) {
        let length = this.pendingFilesQueue.length;

        forEach(fileList, (file: any) => {
            this.enqueueFile(file)
        });

        if (length === 0) {
            this.processQueue();
        }
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

            this.pendingFilesQueue = this.pendingFilesQueue.filter(file => {
                const {name} = file;
                return name !== file_name;
            });

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

                this.processQueue();
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
        this.fetchDocuments();
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
}
