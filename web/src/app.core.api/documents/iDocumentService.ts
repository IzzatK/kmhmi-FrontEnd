import {Nullable} from "../../framework/extras/typeUtils";
import {DocumentInfo, SearchParamInfo, SortPropertyInfo} from "../../app.model";
import {IPlugin} from "../../framework.api";
import {IUserService} from "../users/iUserService";
import {IEntityProvider} from "../common/iEntityProvider";
import {IRepoItem} from "../../framework/services/repoService/repoItem";
import {OutputSelector} from "@reduxjs/toolkit";

export interface IDocumentService extends IPlugin {

    fetchDocument(id: string): void;

    clearSearch(): void;

    fetchDocuments(): void;

    updateDocument(modifiedDocument: Record<string, any>): void;

    removeDocument(id: string): void;

    startUpload(fileList: Record<string, any>): void;

    cancelUpload(id: string): void;

    clearDocuments(): void;

    getDocument(state: any, id: string): Nullable<DocumentInfo>;

    approvePendingFile(id: string): void;

    removePendingFile(id: string): void;

    setUserService(userService: IUserService): void;

    setDocumentProvider(provider: IEntityProvider<DocumentInfo>): void;

    clearAllParams(): void;

    getSearchParams(): Record<string, SearchParamInfo>;

    clearDirtyFlags(): void;

    setSearchText(value: string): void;

    setSearchParam(id: string, value: string | string[]): void;

    setVisibility(id: string, visible: boolean): void;

    getSearchText(): string;

    setSortParam(value: string): void;

    getActiveSortId(): string;

    getSortTypes(): Record<string, SortPropertyInfo>;

    getAllDocuments(): Record<string, DocumentInfo>;

    getSearchDocuments(): Record<string, DocumentInfo>;

    getPendingDocuments(): Record<string, DocumentInfo>;
}