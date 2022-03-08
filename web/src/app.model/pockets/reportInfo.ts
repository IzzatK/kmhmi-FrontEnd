import {WocketInfo} from "./wocketInfo";

export class ReportInfo extends WocketInfo {

  public static class: string = 'ReportInfo';

  pocket_id: string =  '';
  author_id: string =  '';
  title: string =  '';
  date: string =  '';
  citation: CitationType = CitationType.MLA;

  documentIds: Set<string> = new Set<string>();
  excerptIds: Set<string> = new Set<string>();
  noteIds: Set<string> = new Set<string>();

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
