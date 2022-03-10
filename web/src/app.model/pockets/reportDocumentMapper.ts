import {ExcerptMapper} from "./excerptMapper";

import {ReportDocumentInfo} from "./reportDocumentInfo";

export class ReportDocumentMapper {
  protected _id: string;

  constructor(protected _document: ReportDocumentInfo,
              protected _excerptMappers: Record<string, ExcerptMapper>
  )
  {
    this._id = _document.id;
    this._excerptMappers = _excerptMappers;
  }

  get id(): string {
    return this._id;
  }

  get document(): ReportDocumentInfo {
    return this._document;
  }

  get excerptMappers(): Record<string, ExcerptMapper> {
    return this._excerptMappers;
  }
}
