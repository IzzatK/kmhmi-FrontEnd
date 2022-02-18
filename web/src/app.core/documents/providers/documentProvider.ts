import {EntityProvider} from "../../common/providers/entityProvider";
import {DocumentInfo, ParamType, ReferenceInfo, SearchParamInfo, SortPropertyInfo, TagInfo} from "../../../app.model";
import {Nullable} from "../../../framework/extras/typeUtils";
import {DeleteDocumentResponseConverter} from "../converters/deleteDocumentResponseConverter";
import {DocumentResponseConverter} from "../converters/documentResponseConverter";
import {GetDocumentArrayRequestConverter} from "../converters/getDocumentArrayRequestConverter";
import {GetDocumentArrayResponseConverter} from "../converters/getDocumentArrayResponseConverter";
import {GetDocumentResponseConverter} from "../converters/getDocumentResponseConverter";
import {UpdateDocumentRequestConverter} from "../converters/updateDocumentRequestConverter";
import {UploadDocumentRequestConverter} from "../converters/uploadDocumentRequestConverter";
import {UploadDocumentResponseConverter} from "../converters/uploadDocumentResponseConverter";
import {StatusType} from "../../../app.model/statusType";

export const serverUrl = process.env.REACT_APP_SERVER_URL;

export class DocumentProvider extends EntityProvider<DocumentInfo> {
    baseUrl: string = `${serverUrl}/documents`;
    public static class: string = 'DocumentProvider';

    private readonly pollAttempts: Record<string, number>;
    private POLLING_RATE: number;
    private MAX_POLL_ATTEMPTS: number;
    private MAX_NLP_POLL_ATTEMPTS: number;

    private deleteDocumentResponseConverter!: DeleteDocumentResponseConverter;

    private documentResponseConverter!: DocumentResponseConverter;

    private getDocumentResponseConverter!: GetDocumentResponseConverter;

    private getDocumentArrayRequestConverter!: GetDocumentArrayRequestConverter;
    private getDocumentArrayResponseConverter!: GetDocumentArrayResponseConverter;

    private updateDocumentRequestConverter!: UpdateDocumentRequestConverter;

    private uploadDocumentRequestConverter!: UploadDocumentRequestConverter;
    private uploadDocumentResponseConverter!: UploadDocumentResponseConverter;

    constructor() {
        super();
        super.appendClassName(DocumentProvider.class);

        this.pollAttempts = {};
        this.POLLING_RATE = 5000;
        this.MAX_POLL_ATTEMPTS = 3;
        this.MAX_NLP_POLL_ATTEMPTS = 5;
    }

    start() {
        super.start();

        this.deleteDocumentResponseConverter = this.addConverter(DeleteDocumentResponseConverter);

        this.documentResponseConverter = this.addConverter(DocumentResponseConverter);

        this.getDocumentResponseConverter = this.addConverter(GetDocumentResponseConverter);

        this.getDocumentArrayRequestConverter = this.addConverter(GetDocumentArrayRequestConverter);
        this.getDocumentArrayResponseConverter = this.addConverter(GetDocumentArrayResponseConverter);
        this.getDocumentArrayResponseConverter.singleConverter = this.getDocumentResponseConverter;

        this.updateDocumentRequestConverter = this.addConverter(UpdateDocumentRequestConverter);

        this.uploadDocumentRequestConverter = this.addConverter(UploadDocumentRequestConverter);
        this.uploadDocumentResponseConverter = this.addConverter(UploadDocumentResponseConverter);
    }

    create(uiRequestData: any, onUpdated: (item: DocumentInfo) => void): Promise<Nullable<DocumentInfo>> {
        return new Promise((resolve, reject) => {
            this.sendForm(
                () => this.uploadDocumentRequestConverter.convert(uiRequestData),
                (responseData, errorHandler) => this.uploadDocumentResponseConverter.convert(responseData))
                .then(status => {

                    const { id } = status;

                    if (status != null) {
                        let documentInfo = new DocumentInfo(id);
                        onUpdated(documentInfo);
                    }

                    const fetchNow = () => {
                        let pollAttempt: number = this.pollAttempts[id];

                        if (pollAttempt) {
                            this.getSingle(id)
                                .then(latestDocument => {
                                    if (latestDocument != null) {
                                        const {id, isUploading, status} = latestDocument;

                                        latestDocument.isPending = true;
                                        onUpdated(latestDocument);

                                        let pollAttempt = this.pollAttempts[id];

                                        if (pollAttempt) {
                                            if (pollAttempt >= this.MAX_POLL_ATTEMPTS) {
                                                delete this.pollAttempts[id];
                                                // we are completely done.
                                                latestDocument.isPending = true;
                                                if (status === StatusType.SEARCHABLE || status === StatusType.CREATED || status === StatusType.PDF_AVAILABLE) {
                                                    latestDocument.status = StatusType.NLP_COMPLETE;
                                                } else {
                                                    latestDocument.status = StatusType.ERROR;
                                                }
                                                onUpdated(latestDocument);

                                                resolve(latestDocument);
                                            } else if (isUploading || status === StatusType.FAILED) {
                                                this.pollAttempts[id] = pollAttempt + 1;
                                                setTimeout(fetchNow, this.POLLING_RATE);
                                            } else {
                                                if (status === StatusType.NLP_COMPLETE) {
                                                    resolve(latestDocument);
                                                } else if (pollAttempt >= this.MAX_POLL_ATTEMPTS + this.MAX_NLP_POLL_ATTEMPTS) {
                                                    delete this.pollAttempts[id];
                                                    latestDocument.isPending = true;
                                                    onUpdated(latestDocument);
                                                    resolve(latestDocument);
                                                } else {
                                                    latestDocument.isPending = true;
                                                    onUpdated(latestDocument);
                                                    this.pollAttempts[id] = pollAttempt + 1;
                                                    setTimeout(fetchNow, this.POLLING_RATE);
                                                }
                                            }
                                        }
                                    }
                                    else {
                                        setTimeout(fetchNow, this.POLLING_RATE);
                                    }
                                });
                        }
                    }

                    this.pollAttempts[id] = 1;
                    setTimeout(fetchNow, this.POLLING_RATE);


                })
                .catch(error => {
                    reject(error);
                })
            }
        )
    }

    update(id: string, uiRequestData: {id: string, modifiedDocument: Record<string, any>}) : Promise<Nullable<DocumentInfo>> {
        return new Promise((resolve, reject) => {
                this.getSingle(id)
                    .then(latestDocument => {
                        if (latestDocument != null) {
                            let converterData = {
                                id: uiRequestData.id,
                                latestDocument: latestDocument,
                                modifiedDocument: uiRequestData.modifiedDocument,
                            }

                            this.sendPut(id,
                                () => this.updateDocumentRequestConverter.convert(converterData),
                                (responseData, errorHandler) => this.getDocumentResponseConverter.convert(responseData, errorHandler))
                                .then(document => {
                                    //have to fetch from the server
                                    if (document != null) {
                                        resolve(document);
                                    }
                                    else {
                                        reject(`Error Updating Document with id ${id}`);
                                    }
                                })
                                .catch(error => {
                                    console.log(error);
                                });
                        }
                        else {
                            reject(`Document with id ${id} does not exist`)
                        }
                    });
            }
        )
    }

    remove(id: string) : Promise<Nullable<DocumentInfo>> {
        return new Promise((resolve, reject) => {

                // if we are currently polling for this document, then stop
                if (this.pollAttempts[id]) {
                    delete this.pollAttempts[id];
                }

                this.getSingle(id)
                    .then(document => {
                        if (document != null) {
                            super.sendDelete(id,
                                (responseData, errorHandler) => this.getDocumentResponseConverter.convert(responseData, errorHandler))
                                .then(data => {
                                    if (data.id === document.id) {
                                        resolve(document);
                                    }
                                    else {
                                        reject('Could not delete document');
                                    }
                                })
                                .catch(error => {
                                    reject(error);
                                })
                        }
                        else {
                            reject(`Document with id ${id} not found`)
                        }
                    })
                    .catch(error => {
                        reject(error);
                    });
            }
        )
    }

    getSingle(id: string): Promise<Nullable<DocumentInfo>> {
        return new Promise((resolve, reject) => {
            super.sendGetSingle(id,
                (responseData, errorHandler) => this.getDocumentResponseConverter.convert(responseData, errorHandler))
                .then(data => {
                    resolve(data);
                })
                .catch(error => {
                    reject(error);
                })
        });
    }

    getAll(uiRequestData: any): Promise<DocumentInfo[]> {
        return new Promise((resolve, reject) => {
            let requestData: any = this.getDocumentArrayRequestConverter.convert(uiRequestData, reject, { getSearchParamValue: this.getSearchParamValue});

            this.httpService?.createPOST(`${this.baseUrl}/search`, requestData)
                .then((data: any) => {
                    resolve(this.getDocumentArrayResponseConverter.convert(data, reject, { getSearchParamValue: this.getSearchParamValue}));
                })
                .catch((error: any) => {
                    reject(requestData);
                })
        });
    }

    getSearchParamValue(searchParam: SearchParamInfo) {
        const {id, value, type} = searchParam;

        let result = null;

        switch (type) {
            case ParamType.OPTIONS: {
                if (id === 'sort') {
                    const sortTypes = super.getRepoItems<SortPropertyInfo>(SortPropertyInfo.class);
                    let sortType: any = sortTypes[value];
                    result = {
                        [id]: sortType ? sortType.value : null
                    }
                } else if (id === 'tags') {
                    let title: string[] = [];
                    value.forEach((id: string) => {
                        let repoItem: any = super.getRepoItem(TagInfo.class, id);

                        if (repoItem != null) {
                            title.push(repoItem.title);
                        }
                    })

                    result = {
                        ['custom_shared_tag']: title
                    }
                } else {
                    let repoIdArray: string[] = [];
                    value.forEach((id: string) => {
                        let repoItem = super.getRepoItem(ReferenceInfo.class, id);

                        if (repoItem != null) {
                            repoIdArray.push(repoItem.id);
                        }
                    })


                    result = {
                        [id]: repoIdArray
                    }
                }

                break;
            }
            case ParamType.DATE_RANGE: {

                const {start_date, end_date} = value || {};

                let start_date_prop = id.replace('_date', '_start_date');
                let end_date_prop = id.replace('_date', '_end_date');

                result = {
                    [start_date_prop]: start_date,
                    [end_date_prop]: end_date
                }

                break;
            }
            case ParamType.STRING:
                if (id === 'author') {
                    let title = [];
                    title.push(value);
                    result = {
                        [id]: title
                    }
                    break;
                }
                else if (id === 'tags') {
                    let title: string[] = [];
                    value.forEach((id: string) => {
                        let repoItem: any = super.getRepoItem(TagInfo.class, id);

                        if (repoItem != null) {
                            title.push(repoItem.title);
                        }
                    })

                    result = {
                        ['custom_shared_tag']: title
                    }
                }
                else {
                    result = {
                        [id]: value
                    }
                }
                break;
            case ParamType.NUMBER:
            default: {
                result = {
                    [id]: value
                }
                break;
            }
        }

        return result;
    };
}


