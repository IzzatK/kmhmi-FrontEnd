import {WocketInfo} from "./wocketInfo";

export class ReportInfo extends WocketInfo {

  public static class: string = 'ReportInfo';

  author_id: string =  '';
  title: string =  '';
  publication_date: string = '';
  citation: CitationType = CitationType.MLA;
  content: any = [{children: [{ text: "" },],}];
  scope: string = '';
  private_tag: Record<string, Record<string, string>> = {};
  public_tag: Record<string, string> = {};
  html: string = '';
  upload_date: string = '';
  uploadedBy_id: string = '';

  resource_ids: string[] = [];

  isUpdating?: boolean = false;

  constructor(id: string)
  {
    super(id);

    this.appendClassName(ReportInfo.class);
  }
}

export enum CitationType {
  MLA='MLA',
  APA='APA',
  CHICAGO='Chicago',
  Harvard='Harvard'
}
