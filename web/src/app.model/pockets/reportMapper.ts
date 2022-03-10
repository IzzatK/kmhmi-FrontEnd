import {ReportInfo} from "./reportInfo";
import {ReportDocumentMapper} from "./reportDocumentMapper";

export class ReportMapper {
  protected _id: string;

  constructor(protected _report: ReportInfo,
              protected _reportDocumentMappers: Record<string, ReportDocumentMapper>
  )
  {
    this._id = _report.id;
    this._reportDocumentMappers = _reportDocumentMappers;
  }

  get id(): string {
    return this._id;
  }

  get report(): ReportInfo {
    return this._report;
  }

  get reportDocumentMappers(): Record<string, ReportDocumentMapper> {
    return this._reportDocumentMappers;
  }
}
