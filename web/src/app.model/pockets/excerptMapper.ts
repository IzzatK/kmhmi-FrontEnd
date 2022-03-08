import {NoteInfo} from "./noteInfo";
import {ExcerptInfo} from "./excerptInfo";

export class ExcerptMapper {
  protected _id: string;

  constructor(protected _excerpt: ExcerptInfo,
              protected _notes: Record<string, NoteInfo>
  )
  {
    this._id = _excerpt.id;
    this._excerpt = _excerpt;
    this._notes = _notes;
  }

  get id(): string {
    return this._id;
  }

  get excerpt(): ExcerptInfo {
    return this._excerpt;
  }

  get notes(): Record<string, NoteInfo> {
    return this._notes;
  }

}
