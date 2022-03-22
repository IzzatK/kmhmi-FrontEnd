import {RepoItem} from "../framework.core/services";
import {AuthenticationStatus} from "../app.core.api";

export class UserInfo extends RepoItem  {
    public static class: string = 'UserInfo';

    dod_id: string = '';
    first_name: string = '';
    last_name: string = '';
    email_address: string = '';
    phone_number: string = '';
    department: string = '';
    preferred_results_view?: string = '';
    account_status: AuthenticationStatus = AuthenticationStatus.NONE;
    role: string = '';
    registration_reason: string = '';

    approved_by?: string = '';
    date_approved?: string = '';
    isUpdating?: boolean = false;

    constructor(id: string)
    {
        super(id);

        this.appendClassName(UserInfo.class);
    }
}


