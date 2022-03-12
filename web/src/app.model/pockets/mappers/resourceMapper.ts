import {ExcerptMapper} from "./excerptMapper";
import {ResourceInfo} from "../resourceInfo";


export class ResourceMapper {
  protected _id: string;

  constructor(protected _resource: ResourceInfo,
              protected _excerptMappers: Record<string, ExcerptMapper>
  )
  {
    this._id = _resource.id;
    this._excerptMappers = _excerptMappers;
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
