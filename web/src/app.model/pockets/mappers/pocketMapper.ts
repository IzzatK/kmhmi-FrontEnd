import {PocketInfo} from "../pocketInfo";
import {ResourceMapper} from "./resourceMapper";
import {NoteInfo} from "../noteInfo";


export class PocketMapper {
  protected _id: string;
  protected _resourceMappers: Record<string, ResourceMapper> = {};
  protected _pocket: PocketInfo;
  protected _notes: Record<string, NoteInfo> = {};

  constructor(pocket: PocketInfo)
  {
    this._id = pocket.id;
    this._pocket = pocket;
  }

  get id(): string {
    return this._id;
  }

  get pocket(): PocketInfo {
    return this._pocket;
  }

  get resourceMappers(): Record<string, ResourceMapper> {
    return this._resourceMappers;
  }

  get notes(): Record<string, NoteInfo> {
    return this._notes;
  }
}
