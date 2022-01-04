import React, {Component} from "react";
import {ProfilePanelProps, ProfilePanelState} from "./profilePanelModel";
import {bindInstanceMethods} from "../../../../framework/extras/typeUtils";
import Button from "../../../theme/widgets/button/button";
import Card from "../../../theme/widgets/card/card";
import {InfoSVG} from "../../../theme/svgs/infoSVG";
import ComboBox from "../../../theme/widgets/comboBox/comboBox";


export class UserRequestInfoView extends Component<ProfilePanelProps, ProfilePanelState> {
    constructor(props: ProfilePanelProps | Readonly<ProfilePanelProps>) {
        super(props);

        bindInstanceMethods(this);

        this.state = {
            tmpUser: {},
            editProperties: [],
            selected: false,
        }
    }

    componentDidMount() {

    }

    componentDidUpdate(prevProps: Readonly<ProfilePanelProps>, prevState: Readonly<ProfilePanelState>, snapshot?: any) {

    }

    toggleSelected() {
        const { onSelect } = this.props;
        const { selected } = this.state;

        this.setState({
            ...this.state,
            selected: !selected,
        })
        if (selected && onSelect) {
            onSelect();
        }
    }

    onAccept() {
        const { onAccept, userRequest } = this.props;

        if (userRequest) {
            const { id } = userRequest;
            if (onAccept) onAccept(id);
        }
    }

    onDecline() {
        const { onDecline, userRequest } = this.props;

        if (userRequest) {
            const { id } = userRequest;
            if (onDecline) onDecline(id);
        }
    }

    render() {
        const { userRequest, roles } = this.props;

        const { selected } = this.state;

        let cn = "user-request-header p-3 d-flex align-items-center justify-content-between";

        let roleId = userRequest?.role;
        let roleTitle = '';
        if (roleId) {
            if (roles && roles[roleId]) {
                roleTitle = roles[roleId].title;
            }
            else {
                roleTitle = roleId;
            }
        }

        let durationTitle = userRequest?.duration || '';

        return (
            <Card className={'user-request flex-column justify-content-start header-4 align-items-stretch'}
                  header={
                      <div
                          onClick={() => this.toggleSelected()}
                          className={cn}>
                          <div className={'d-flex h-gap-4 px-5 py-4'}>
                              <div className={'header-1 font-weight-semi-bold'}>Request: {userRequest?.name}</div>
                          </div>
                      </div>
                  }
                  body={
                      <div className={'p-3'}>
                          <div className={'request-info-grid'}>
                              <div className={'header-2 text-right'}>Role:</div>
                              <div className={'header-2 text-right text-wrap'}>Reason for Authentication:</div>
                              <div className={'d-flex justify-content-between'}>
                                  <ComboBox title={roleTitle} disable={true}/>
                                  <div className={'header-2 text-accent'}>for</div>
                                  <ComboBox title={durationTitle} disable={true}/>
                              </div>
                              <div className={'header-1 font-italic font-weight-light text-info'}>{userRequest?.reason}</div>
                          </div>

                          <div className={"d-flex justify-content-between"}>
                              <div className={"d-flex info-button justify-content-start"}>
                                  <div className={'d-flex h-gap-3 align-items-center'}>
                                      <InfoSVG className={'small-image-container'}/>
                                      <div className={'header-2'}>More Info</div>
                                  </div>
                              </div>
                              <div className={'d-flex h-gap-2 justify-content-end'}>
                                  <Button text={"Decline"} highlight={true} orientation={"horizontal"} onClick={() => this.onDecline()} selected={false} disabled={false} className={"px-5"}/>
                                  <Button text={"Accept"} orientation={"horizontal"} onClick={() => this.onAccept()} selected={false} disabled={false} className={"px-5"}/>
                              </div>

                          </div>
                      </div>
                  }
                  selected={selected}
            />
        );
    }
}
