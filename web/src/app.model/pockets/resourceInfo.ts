import {WocketInfo} from "./wocketInfo";

export class ResourceInfo extends WocketInfo {

  public static class: string = 'ResourceInfo';

  title: string = '';
  author_id: string = '';
  excerptIds: string[] = [];

  source_id: string = '';
  source_author: string = '';
  source_publication_date: string = 'string';
  source_title: string = '';
  source_type: string = '';
  source_version: string = '';

  constructor(id: string)
  {
    super(id);

    this.appendClassName(ResourceInfo.class);
  }
}
