import {WocketInfo} from "./wocketInfo";

export class ExcerptInfo extends WocketInfo {

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
