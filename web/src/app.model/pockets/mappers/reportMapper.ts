import {ReportInfo} from "../reportInfo";
import {ResourceMapper} from "./resourceMapper";

export class ReportMapper {
  protected _id: string;
  protected _resourceMappers: Record<string, ResourceMapper> = {};

  constructor(protected _report: ReportInfo)
  {
    this._id = _report.id;
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
