import {ReportInfo} from "../reportInfo";
import {ResourceMapper} from "./resourceMapper";

export class ReportMapper {
  protected _id: string;
  protected _resourceMappers: Record<string, ResourceMapper> = {};
  protected _report: ReportInfo

  constructor(report: ReportInfo)
  {
    this._id = report.id;
    this._report = report;
  }

  get id(): string {
    return this._id;
  }

  get report(): ReportInfo {
    return this._report;
  }

  get resourceMappers(): Record<string, ResourceMapper> {
    return this._resourceMappers;
  }
}
