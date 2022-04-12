import {Plugin} from "../../framework.core/extras/plugin";
import {IReportService, ReportParamType} from "../../app.core.api";
import {IEntityProvider, ISelectionService} from "../../framework.core.api";
import {ReportInfo} from "../../app.model";
import {Nullable} from "../../framework.core/extras/utils/typeUtils";
import {createSelector, Selector} from "@reduxjs/toolkit";
import {IUserService} from "../../app.core.api";
import {forEach, forEachKVP} from "../../framework.core/extras/utils/collectionUtils";

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
            [(s) => this.getAll<ReportInfo>(ReportInfo.class), (s) => this.userService?.getCurrentUserId()],
            (reports, currentUserId) => {
                let result: Record<string, ReportInfo> = {};

                if (reports) {
                    forEach(reports, (report: ReportInfo) => {
                        if (report) {
                            let private_tag: any = [];
                            if (report.private_tag) {
                                forEach(report.private_tag, (item:{user_id:string, tag_id: string}) => {
                                    let user_id = item.user_id;
                                    if (user_id === currentUserId) {
                                        private_tag = item['tag_id'];
                                    }
                                })
                            }

                            let userReport = report;
                            Object.assign(userReport.private_tag, private_tag);

                            result[report.id] = userReport;
                        }
                    });

                    return result;
                }
                return result;
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

    updateReport(modifiedReport: any): void {
        const { id } = modifiedReport;

        if (id) {
            const report = this.getReport(id);

            if (report) {
                const { private_tag:original_private_tag } = report;

                if (modifiedReport.hasOwnProperty('private_tag')) {
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
                        total_private_tag[currentUserId] = modifiedReport['private_tag'];
                    }

                    modifiedReport = {
                        ...modifiedReport,
                        private_tag: total_private_tag,
                    }
                }
            }

            let mergedReport = {
                ...modifiedReport,
                isUpdating: true
            }

            this.addOrUpdateRepoItem(mergedReport)

            this.reportProvider?.update(id, mergedReport)
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

    createReport(params: ReportParamType): Promise<Nullable<ReportInfo>> {
        return new Promise<Nullable<ReportInfo>>((resolve, reject) => {
            this.reportProvider?.create(params)
                .then(result => {
                    if (result != null) {
                        this.addOrUpdateRepoItem(result);
                        resolve(result);
                    }
                })
                .catch(error => {
                    reject(error);
                });
        })

    }
}
