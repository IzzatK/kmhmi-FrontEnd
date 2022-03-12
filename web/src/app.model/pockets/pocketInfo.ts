import {WocketInfo} from "./wocketInfo";

export class PocketInfo extends WocketInfo {

  public static class: string = 'PocketInfo';

  title: string =  '';
  author_id: string = '';

  resource_ids: string[] = [];

  constructor(id: string)
  {
    super(id);

    this.appendClassName(PocketInfo.class);
  }
}
