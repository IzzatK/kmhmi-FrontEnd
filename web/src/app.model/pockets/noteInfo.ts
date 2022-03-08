import {WocketInfo} from "./wocketInfo";

export class NoteInfo extends WocketInfo {

  public static class: string = 'PocketInfo';

  text: string = '';
  content: string = '';
  authorId: string = '';

  constructor(id: string)
  {
    super(id);

    this.appendClassName(NoteInfo.class);
  }
}
