import {WocketInfo} from "./wocketInfo";

export class ReportDocumentInfo extends WocketInfo {

  public static class: string = 'ReportDocumentInfo';

  title: string = '';
  publication_date: string = '';
  author_id: string = '';

  constructor(id: string)
  {
    super(id);

    this.appendClassName(ReportDocumentInfo.class);
  }
}
