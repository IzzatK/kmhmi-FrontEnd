import {RepoItem} from "../framework/services/repoService/repoItem";
import {ReferenceType} from "./referenceType";

export class ReferenceInfo extends RepoItem{

  public static class: string = 'ReferenceInfo';

  constructor(
      public id: string,
      public title: string,
      public type: ReferenceType
      )
  {
    super(id);
    this.appendClassName(ReferenceInfo.class);

    this.title = title;
  }
}