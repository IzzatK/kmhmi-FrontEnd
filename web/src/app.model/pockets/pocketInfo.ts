import {WocketInfo} from "./wocketInfo";

export class PocketInfo extends WocketInfo {

  public static class: string = 'PocketInfo';

  title: string =  '';
  author_id: string = '';
  scope: string = '';
  upload_date: string = '';
  uploadedBy_id: string = '';
  private_tag: Record<string, Record<string, string>> = {};
  public_tag: Record<string, string> = {};

  resource_ids: string[] = [];
  note_ids: string[] = [];
  report_ids: string[] = [];

  isUpdating: boolean = false;

  constructor(id: string)
  {
    super(id);

    this.appendClassName(PocketInfo.class);
  }
}
