import {RepoItem} from "../framework.core/services/repoService/repoItem";

export class ExcerptInfo extends RepoItem {

  public static class: string = 'ExcerptInfo';

  text?: string = '';
  content?: string = '';
  location? : string = '';
  resourceId: string = '';
  authorId?: string = '';
  reportId: string = '';

  constructor(id: string)
  {
    super(id);

    this.appendClassName(ExcerptInfo.class);
  }
}
