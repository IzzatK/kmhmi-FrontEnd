import {NoteInfo} from "../noteInfo";
import {ExcerptInfo} from "../excerptInfo";

export class ExcerptMapper {
  protected _id: string;
  protected _notes: Record<string, NoteInfo> = {};
  protected _excerpt: ExcerptInfo;

  constructor(excerpt: ExcerptInfo)
  {
    this._id = excerpt.id;
    this._excerpt = excerpt;
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
