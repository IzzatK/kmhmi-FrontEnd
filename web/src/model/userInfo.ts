import {RepoItem} from "../framework/services/repoService/repoItem";

export class UserInfo extends RepoItem  {
    public static class: string = 'UserInfo';

    dod_id: number = -1;
    first_name: string = '';
    last_name: string = '';
    email_address: string = '';
    phone_number: string = '';
    department: string = '';
    preferred_results_view?: string = '';
    account_status: string = '';
    role: string = '';

    approved_by?: string = '';
    date_approved?: string = '';
    isUpdating?: boolean = false;

    constructor(id: string)
    {
        super(id);

        this.appendClassName(UserInfo.class);
    }
}


