import {IEntityProvider, IPlugin, ISelectionService} from "../../framework.core.api";
import {ReportInfo} from "../../app.model";
import {Nullable} from "../../framework.core/extras/utils/typeUtils";
import {IUserService} from "../users/iUserService";

export interface IReportService extends IPlugin {

    setReportProvider(provider: IEntityProvider<ReportInfo>): void;
    setSelectionService(service: ISelectionService): void;
    setUserService(userService: IUserService): void;

    fetchReport(id: string): void;
    fetchReports(): void;
    updateReport(params: ReportParamType): void;
    removeReport(id: string): Promise<Nullable<string>>;
    createReport(params: ReportParamType): Promise<Nullable<ReportInfo>>;

    getReport(id: string): Nullable<ReportInfo>;
    getReports(): Record<string, ReportInfo>;
}

type OmitParamsType = 'className';

export type ReportParamType = Omit<Partial<ReportInfo>, OmitParamsType>
