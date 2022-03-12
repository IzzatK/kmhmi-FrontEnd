import {WocketInfo} from "./wocketInfo";

export class ResourceInfo extends WocketInfo {

  public static class: string = 'ResourceInfo';

  title: string = '';
  publication_date: string = '';
  author_id: string = '';
  excerptIds: string[] = [];

  constructor(id: string)
  {
    super(id);

    this.appendClassName(ResourceInfo.class);
  }
}
