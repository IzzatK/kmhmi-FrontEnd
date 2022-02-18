import {RepoItem} from "../framework/services/repoService/repoItem";
import {StatusType} from "./statusType";

export class DocumentInfo extends RepoItem{

  public static class: string = 'DocumentInfo';

  author: string = '';
  department: string = '';
  file_name: string = '';
  file_page_count: string = '';
  file_size: string = '';
  file_type: string = '';
  primary_sme_email: string = '';
  primary_sme_name: string = '';
  primary_sme_phone: string = '';
  private_tag: any = '';
  project: string = '';
  public_tag: any = '';
  publication_date: string = '';
  purpose: string = '';
  secondary_sme_email: string = '';
  secondary_sme_name: string = '';
  secondary_sme_phone: string = '';
  status: StatusType = StatusType.DRAFT;
  scope: string = '';
  title: string = '';
  upload_date: string = '';
  uploadedBy_id: string = '';

  suggested_author: string = '';
  suggested_publication_date: string = '';
  suggested_title: string = '';
  suggested_locations: string = '';
  suggested_organizations: string = '';
  suggested_references: string = '';
  suggested_topics: string = '';

  preview_url: string = '';
  original_url: string = '';
  isUpdating: boolean = false;
  isUploading: boolean = false;
  isPending: boolean = false;
  isDeleted?: boolean = false;

  constructor(id: string)
  {
    super(id);

    this.appendClassName(DocumentInfo.class);
  }
}
