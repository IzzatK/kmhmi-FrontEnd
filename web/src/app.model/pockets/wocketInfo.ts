import {IRepoItem, RepoItem} from "../../framework.core/services/repoService/repoItem";

export class WocketInfo extends RepoItem implements IWocketInfo {

  public static class: string = 'WocketInfo';

  constructor(id: string)
  {
    super(id);

    this.appendClassName(WocketInfo.class);
  }
}

export interface IWocketInfo extends IRepoItem {

}
