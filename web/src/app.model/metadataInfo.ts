import {RepoItem} from "../framework.core/services/repoService/repoItem";

export class MetadataInfo extends RepoItem {
  public static class: string = 'MetadataInfo';

  isLoading: boolean = false;
  hasError: boolean = false;
  errorMessage: string= '';

  constructor(id: string)
  {
    super(id);

    this.appendClassName(MetadataInfo.class);
  }
}

export enum MetadataType {
  DOCUMENTS_GET_ARRAY='DOCUMENTS_GET_ARRAY',
  REFERENCE_GET_SINGLE='REFERENCE_GET_SINGLE',
  AUTHENTICATION='AUTHENTICATION'
}
