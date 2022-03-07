import {RepoItem} from "../framework.core/services/repoService/repoItem";

export class ReportInfo extends RepoItem {

  public static class: string = 'ReportInfo';

  pocket_id: string =  '';
  author_id: string =  '';
  title: string =  '';
  date: string =  '';
  citation: CitationType = CitationType.MLA;

  documentIds?: Set<string>;
  excerptIds?: Set<string>;
  noteIds?: Set<string>;

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
