import {Component} from "react";
import {UserGuidePanelPresenterProps, UserGuidePanelPresenterState} from "../userGuidePanelModel";
import UserGuidePanelView from "../views/userGuidePanelView";
import {bindInstanceMethods} from "../../../../framework.core/extras/utils/typeUtils";

class UserGuidePanelPresenter extends Component<UserGuidePanelPresenterProps, UserGuidePanelPresenterState> {
    constructor(props: any, context: any) {
        super(props, context);
        bindInstanceMethods(this);

        this.state = {

        };
    }

    render() {
        return (
            <UserGuidePanelView
                className={this.props.className}
                helpDocument={this.props.helpDocument}
                userProfile={this.props.userProfile}
                token={this.props.token}
            />
        );
    }
}

export default UserGuidePanelPresenter;