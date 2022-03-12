import {WocketInfo} from "./wocketInfo";

export class NoteInfo extends WocketInfo {

  public static class: string = 'NoteInfo';

  text: string = '';
  content: string = '';
  author_id: string = '';

  constructor(id: string)
  {
    super(id);

    this.appendClassName(NoteInfo.class);
  }
}
