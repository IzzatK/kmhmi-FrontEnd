import {ExcerptMapper} from "./excerptMapper";
import {ResourceInfo} from "../resourceInfo";


export class ResourceMapper {
  protected _id: string;
  protected _excerptMappers: Record<string, ExcerptMapper> = {};
  protected _resource: ResourceInfo;

  constructor(resource: ResourceInfo)
  {
    this._id = resource.id;
    this._resource = resource;
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
