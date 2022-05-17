import {IEntityProvider, IPlugin, ISelectionService} from "../../framework.core.api";
import {DocumentInfo, ReportInfo} from "../../app.model";
import {Nullable} from "../../framework.core/extras/utils/typeUtils";
import {IUserService} from "../users/iUserService";
import {IDocumentService} from "../documents/iDocumentService";

export interface IReportService extends IPlugin {

    setReportProvider(provider: IEntityProvider<ReportInfo>): void;
    setPublishedReportProvider(provider: IEntityProvider<DocumentInfo>): void;
    setSelectionService(service: ISelectionService): void;
    setUserService(userService: IUserService): void;

    fetchReport(id: string): void;
    fetchReports(): void;
    updateReport(params: ReportParamType): void;
    publishReport(params: ReportParamType): Promise<Nullable<DocumentInfo>>;
    removeReport(id: string): Promise<Nullable<string>>;
    createReport(params: ReportParamType): Promise<Nullable<ReportInfo>>;

    getReport(id: string): Nullable<ReportInfo>;
    getReports(): Record<string, ReportInfo>;
}

type OmitParamsType = 'className';

export type ReportParamType = Omit<Partial<ReportInfo>, OmitParamsType>
