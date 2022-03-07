import {RepoItem} from "../framework.core/services/repoService/repoItem";

export class NoteInfo extends RepoItem {

  public static class: string = 'PocketInfo';

  text: string = '';
  content: string = '';
  authorId: string = '';
  excerptId: string = '';
  reportId: string = '';

  constructor(id: string)
  {
    super(id);

    this.appendClassName(NoteInfo.class);
  }
}
