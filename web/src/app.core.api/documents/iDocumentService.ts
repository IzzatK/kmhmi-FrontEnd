import {Nullable} from "../../framework.core/extras/utils/typeUtils";
import {DocumentInfo, SearchParamInfo, SortPropertyInfo} from "../../app.model";
import {IPlugin} from "../../framework.core.api";
import {IUserService} from "../users/iUserService";
import {IEntityProvider} from "../../framework.core.api";
import {IPocketService} from "../pockets/iPocketService";
import {IReportService} from "../reports/iReportService";

export interface IDocumentService extends IPlugin {

    fetchDocument(id: string): void;

    clearSearch(): void;

    fetchDocuments(): void;

    fetchSearchResults(): void;

    fetchUploadedDocuments(): void;

    updateDocument(modifiedDocument: Record<string, any>): void;

    removeDocument(id: string): void;

    startUpload(fileList: Record<string, any>): void;

    cancelUpload(id: string): void;

    clearDocuments(): void;

    getDocument(id: string): Nullable<DocumentInfo>;

    approvePendingFile(id: string): void;

    removePendingFile(id: string): void;

    setUserService(userService: IUserService): void;

    setPocketService(pocketService: IPocketService): void;

    setReportService(reportsService: IReportService): void;

    setDocumentProvider(provider: IEntityProvider<DocumentInfo>): void;

    setSearchResultsProvider(provider: IEntityProvider<any>): void;

    clearAllParams(): void;

    getSearchParams(): Record<string, SearchParamInfo>;

    getSearchParam(id: string): Nullable<SearchParamInfo>;

    clearDirtyFlags(): void;

    setSearchText(value: string): void;

    setSearchParam(id: string, value: string | string[]): void;

    setVisibility(id: string, visible: boolean): void;

    getSearchText(): string;

    setSortParam(value: string): void;

    getActiveSortId(): string;

    getSortTypes(): Record<string, SortPropertyInfo>;

    getAllDocuments(): Record<string, DocumentInfo>;

    getSearchResults(): Record<string, any>;

    getPendingDocuments(): Record<string, DocumentInfo>;
}

type OmitParamsType = 'className';

export type DocumentParamType = Omit<Partial<DocumentInfo>, OmitParamsType>
