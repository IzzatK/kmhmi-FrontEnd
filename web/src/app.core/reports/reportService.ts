import {Plugin} from "../../framework.core/extras/plugin";
import {IReportService, ReportParamType} from "../../app.core.api";
import {IEntityProvider, ISelectionService} from "../../framework.core.api";
import {ReportInfo} from "../../app.model";
import {Nullable} from "../../framework.core/extras/utils/typeUtils";
import {createSelector, Selector} from "@reduxjs/toolkit";
import {IUserService} from "../../app.core.api";

export class ReportService extends Plugin implements IReportService {
    public static readonly class: string = 'ReportService';

    private userService: Nullable<IUserService> = null;
    private selectionService: Nullable<ISelectionService> = null;

    private readonly getAllReportsSelector: Selector<any, Record<string, ReportInfo>>;
    private reportProvider: Nullable<IEntityProvider<ReportInfo>> = null;

    constructor() {
        super();
        this.appendClassName(ReportService.class);

        this.getAllReportsSelector = createSelector(
            [() => super.getAll<ReportInfo>(ReportInfo.class)],
            (items) => {
                return items;
            }
        );
    }

    setReportProvider(provider: IEntityProvider<ReportInfo>): void {
        this.reportProvider = provider;
    }

    setUserService(service: IUserService): void {
        this.userService = service;
    }

    setSelectionService(service: ISelectionService): void {
        this.selectionService = service;
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

    fetchReport(id: string): Promise<Nullable<ReportInfo>> {
        return new Promise<Nullable<ReportInfo>>(
            ((resolve, reject) => {
                this.reportProvider?.getSingle(id)
                    .then(latestReport => {
                        let localReport: any = this.getReport(id);

                        let nextReport = {
                            ...latestReport,
                            ...localReport,
                        }

                        this.addOrUpdateRepoItem(nextReport);

                        resolve(nextReport);
                    })
                    .catch(error => {
                        reject(error);
                    });
            })
        );
    }

    fetchReports(): void {
        const user_id = this.userService?.getCurrentUserId();

        this.reportProvider?.getAll(user_id)
            .then((reportInfos: ReportInfo[]) => {
                this.addOrUpdateAllRepoItems(reportInfos);
            })
            .catch(error => {
                console.log(error);
            });
    }

    getReport(id: string): Nullable<ReportInfo> {
        return super.getRepoItem<ReportInfo>(ReportInfo.class, id);
    }

    getReports(): Record<string, ReportInfo> {
        return this.getAllReportsSelector(super.getRepoState());
    }

    removeReport(id: string): void {
        this.reportProvider?.remove(id)
            .then(report => {
                if (report) {
                    this.removeRepoItem(report)
                }
            })
            .catch(error => {
                console.log(error);
            });
    }

    updateReport(params: ReportParamType): void {
        const { id } = params;

        if (id) {
            const report = this.getReport(id);

            if (report) {
                let modifiedReport = {
                    ...report,
                    ...params,
                    isUpdating: true
                }

                this.addOrUpdateRepoItem(modifiedReport)
            }

            this.reportProvider?.update(id, params)
                .then(report => {
                    if (report != null) {
                        this.addOrUpdateRepoItem(report);
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }

    createReport(params: ReportParamType): void {
        this.reportProvider?.create(params)
            .then(result => {
                if (result != null) {
                    this.addOrUpdateRepoItem(result);
                }
            })
            .catch(error => {
                console.log(error);
            });
    }
}