import {WocketInfo} from "./wocketInfo";

export class ExcerptInfo extends WocketInfo {

  public static class: string = 'ExcerptInfo';

  text: string = '';
  content: string = '';
  location : string = '';
  authorId: string = '';
  noteIds: string[] = [];

  constructor(id: string)
  {
    super(id);

    this.appendClassName(ExcerptInfo.class);
  }
}
