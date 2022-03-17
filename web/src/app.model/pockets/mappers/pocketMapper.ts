import {PocketInfo} from "../pocketInfo";
import {ResourceMapper} from "./resourceMapper";


export class PocketMapper {
  protected _id: string;
  protected _resourceMappers: Record<string, ResourceMapper> = {};
  protected _pocket: PocketInfo;

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
}
