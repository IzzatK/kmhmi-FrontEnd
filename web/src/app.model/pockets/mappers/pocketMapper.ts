import {PocketInfo} from "../pocketInfo";
import {ResourceMapper} from "./resourceMapper";


export class PocketMapper {
  protected _id: string;

  constructor(protected _pocket: PocketInfo,
              protected _resourceMappers: Record<string, ResourceMapper>)
  {
    this._id = _pocket.id;
    this._pocket = _pocket;
    this._resourceMappers = _resourceMappers;
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
