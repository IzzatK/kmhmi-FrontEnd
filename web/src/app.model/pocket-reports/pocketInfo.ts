import {RepoItem} from "../../framework.core/services/repoService/repoItem";

export class PocketInfo extends RepoItem {

  public static class: string = 'PocketInfo';

  title: string =  '';
  author_id: string = '';

  reportId: string = '';

  constructor(id: string)
  {
    super(id);

    this.appendClassName(PocketInfo.class);
  }
}
