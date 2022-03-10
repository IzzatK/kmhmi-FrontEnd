import {WocketInfo} from "./wocketInfo";

export class ReportInfo extends WocketInfo {

  public static class: string = 'ReportInfo';

  author_id: string =  '';
  title: string =  '';
  date: string =  '';
  citation: CitationType = CitationType.MLA;

  document_ids: string[] = [];

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
