import {ExcerptMapper} from "./excerptMapper";
import {ResourceInfo} from "../resourceInfo";


export class ResourceMapper {
  protected _id: string;
  protected _excerptMappers: Record<string, ExcerptMapper> = {};

  constructor(protected _resource: ResourceInfo)
  {
    this._id = _resource.id;
  }

  get id(): string {
    return this._id;
  }

  get resource(): ResourceInfo {
    return this._resource;
  }

  get excerptMappers(): Record<string, ExcerptMapper> {
    return this._excerptMappers;
  }
}
