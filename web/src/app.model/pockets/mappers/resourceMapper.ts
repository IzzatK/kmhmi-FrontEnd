import {ExcerptMapper} from "./excerptMapper";
import {ResourceInfo} from "../resourceInfo";
import {NoteInfo} from "../noteInfo";


export class ResourceMapper {
  protected _id: string;
  protected _excerptMappers: Record<string, ExcerptMapper> = {};
  protected _resource: ResourceInfo;
  protected _notes: Record<string, NoteInfo> = {};

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

  get notes(): Record<string, NoteInfo> {
    return this._notes;
  }
}
