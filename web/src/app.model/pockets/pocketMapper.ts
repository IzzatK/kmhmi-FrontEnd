import {NoteInfo} from "./noteInfo";
import {PocketInfo} from "./pocketInfo";
import {ExcerptInfo} from "./excerptInfo";
import {ReportDocumentInfo} from "./reportDocumentInfo";
import {ReportInfo} from "./reportInfo";

export class PocketMapper {
  protected _id: string;

  constructor(protected _pocket: PocketInfo,
              protected _report: ReportInfo,
              protected _notes: Record<string, NoteInfo>,
              protected _excerpts: Record<string, ExcerptInfo>,
              protected _documents: Record<string, ReportDocumentInfo>
  )
  {
    this._id = _pocket.id;
    this._pocket = _pocket;
    this._report = _report;
    this._notes = _notes;
    this._excerpts = _excerpts;
    this._documents = _documents;
  }

  get id(): string {
    return this._id;
  }

  get pocket(): PocketInfo {
    return this._pocket;
  }

  get report(): ReportInfo {
    return this._report;
  }

  get notes(): Record<string, NoteInfo> {
    return this._notes;
  }

  get excerpts(): Record<string, ExcerptInfo> {
    return this._excerpts;
  }

  get documents(): Record<string, ReportDocumentInfo> {
    return this._documents;
  }
}
