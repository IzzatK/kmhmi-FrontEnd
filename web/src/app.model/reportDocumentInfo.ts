import {DocumentInfo} from "./documentInfo";

export class ReportDocumentInfo extends DocumentInfo {

  public static class: string = 'ReportDocumentInfo';

  constructor(id: string)
  {
    super(id);

    this.appendClassName(ReportDocumentInfo.class);
  }
}
