import {ReportInfo} from "../reportInfo";
import {ResourceMapper} from "./resourceMapper";

export class ReportMapper {
  protected _id: string;

  constructor(protected _report: ReportInfo,
              protected _resourceMappers: Record<string, ResourceMapper>
  )
  {
    this._id = _report.id;
    this._resourceMappers = _resourceMappers;
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
