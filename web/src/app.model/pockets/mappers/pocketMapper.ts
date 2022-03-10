import {PocketInfo} from "../pocketInfo";
import {ReportMapper} from "./reportMapper";

export class PocketMapper {
  protected _id: string;

  constructor(protected _pocket: PocketInfo,
              protected _reportMappers: Record<string, ReportMapper>)
  {
    this._id = _pocket.id;
    this._pocket = _pocket;
    this._reportMappers = _reportMappers;
  }

  get id(): string {
    return this._id;
  }

  get pocket(): PocketInfo {
    return this._pocket;
  }

  get reportMappers(): Record<string, ReportMapper> {
    return this._reportMappers;
  }
}
