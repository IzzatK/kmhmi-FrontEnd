import {createSelector, OutputSelector} from "@reduxjs/toolkit";
import {forEach} from "../../framework.visual/extras/utils/collectionUtils";
import {
    DocumentInfo,
    MetadataInfo,
    MetadataType,
    ParamType,
    ReferenceInfo,
    SearchParamInfo,
    SortPropertyInfo,
    TagInfo
} from "../../model";
import {Nullable} from "../../framework/extras/typeUtils";

import {IDocumentService, IEntityProvider, IUserService} from "../../api";
import {Plugin} from "../../framework/extras/plugin";
import {getDateWithoutTime} from "../../framework.visual/extras/utils/timeUtils";

export class DocumentService extends Plugin implements IDocumentService {
    public static readonly class:string = 'DocumentService';
    private userService: Nullable<IUserService> = null;
    private documentProvider?: Nullable<IEntityProvider<DocumentInfo>> = null;

    private readonly pendingFilesRaw: Record<string, any>;

    getAllDocumentsSelector: OutputSelector<unknown, Record<string, DocumentInfo>, (res1: Record<string, DocumentInfo>, res2: any) => Record<string, DocumentInfo>>;
    getSearchDocumentsSelector: OutputSelector<unknown, Record<string, DocumentInfo>, (res: Record<string, DocumentInfo>) => Record<string, DocumentInfo>>;
    getPendingDocumentsSelector: OutputSelector<unknown, Record<string, DocumentInfo>, (res: Record<string, DocumentInfo>) => Record<string, DocumentInfo>>;


    constructor() {
        super();
        this.appendClassName(DocumentService.class);

        this.pendingFilesRaw = {};

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
                    const {id} = document;

                    let localDocument = this.getDocument(id);

                    let nextDocument = {
                        ...localDocument,
                        ...document,
                        isPending: localDocument?.isPending ? localDocument.isPending : document.isPending
                    }

                    this.addOrUpdateRepoItem(nextDocument);
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
            let total_private_tag: any = [];

            let currentUserId = this.userService?.getCurrentUserId();

            if (document != null && document.private_tag && document.private_tag.length > 0) {
                forEach(document.private_tag, (item: { user_id: string, tag_id: any }) => {
                    let tagUserId = item['user_id'];
                    let tagArray = item['tag_id'];

                    total_private_tag.push({
                        tag_id: currentUserId === tagUserId ?
                            modifiedDocument['private_tag'] :
                            tagArray,
                        user_id: tagUserId
                    })
                })
                modifiedDocument = {
                    ...modifiedDocument,
                    private_tag: total_private_tag
                }
            } else {
                modifiedDocument = {
                    ...modifiedDocument,
                    private_tag: [
                        {
                            tag_id: modifiedDocument['private_tag'],
                            user_id: currentUserId
                        }
                    ]
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
                    this.addOrUpdateRepoItem(document)
                }
            })
            .catch(error => {
                console.log(error);
            });
    }

    removeDocument(id: string) {
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
        forEach(fileList, (item: any) => {

            const file = item;

            const {name} = file;

            // since we are posting and don't have an id yet, use a placeholder
            let tmpId = name;

            // redux raw file
            this.pendingFilesRaw[tmpId] = file;

            // put the file in the pending documents list
            // id will be auto generated client side
            let tmpFileInfo = new DocumentInfo(tmpId);
            tmpFileInfo.file_name = name;
            tmpFileInfo.status = 'Uploading';
            tmpFileInfo.isPending = true;

            this.addOrUpdateRepoItem(tmpFileInfo)

            let requestData = {
                id: tmpId,
                pendingFilesRaw: this.pendingFilesRaw,
                file
            };

            this.documentProvider?.create(requestData,
                (updatedDocument) => {
                    const {id} = updatedDocument;

                    if (this.pendingFilesRaw[tmpId]) {
                        delete this.pendingFilesRaw[tmpId];
                        this.removeAllById(DocumentInfo.class, tmpId);

                        // put the document back in with the new id
                        this.pendingFilesRaw[id] = file;

                        updatedDocument.file_name = name;
                        updatedDocument.status = 'Processing';
                        updatedDocument.isPending = true;
                    }


                    this.addOrUpdateRepoItem(updatedDocument);
                })
                .then(document => {
                    if (document != null) {
                        this.addOrUpdateRepoItem(document);
                    }
                })
                .catch(error => {

                })
        });
    }

    clearDocuments() {
        this.removeAllByType(DocumentInfo.class);
    }

    getDocument(id: string): Nullable<DocumentInfo> {
        return super.getRepoItem<DocumentInfo>(DocumentInfo.class, id);
    }

    removePendingFile(id: string) {
        this.removeDocument(id);

        // delete raw file
        if (this.pendingFilesRaw[id]) {
            delete this.pendingFilesRaw[id];
        }

        // update in repo
        this.removeAllById(DocumentInfo.class, id);
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
            next.dirty = true;
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
