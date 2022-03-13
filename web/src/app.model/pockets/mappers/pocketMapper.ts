import {PocketInfo} from "../pocketInfo";
import {ResourceMapper} from "./resourceMapper";


export class PocketMapper {
  protected _id: string;
  protected _resourceMappers: Record<string, ResourceMapper> = {};

  constructor(protected _pocket: PocketInfo)
  {
    this._id = _pocket.id;
    this._pocket = _pocket;
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
}
