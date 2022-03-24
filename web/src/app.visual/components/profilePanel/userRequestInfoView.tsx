import React, {Component} from "react";
import {ProfilePanelProps, ProfilePanelState} from "./profilePanelModel";
import {bindInstanceMethods} from "../../../framework.core/extras/utils/typeUtils";
import Button from "../../theme/widgets/button/button";
import Card from "../../theme/widgets/card/card";
import ComboBox from "../../theme/widgets/comboBox/comboBox";
import {LoadingIndicator} from "../../theme/widgets/loadingIndicator/loadingIndicator";
import {Size} from "../../theme/widgets/loadingIndicator/loadingIndicatorModel";

export class UserRequestInfoView extends Component<ProfilePanelProps, ProfilePanelState> {
    constructor(props: ProfilePanelProps | Readonly<ProfilePanelProps>) {
        super(props);

        bindInstanceMethods(this);

        this.state = {
            editProperties: [],
            isUpdating: false,
        }
    }

    _onToggleSelected() {
        const { onSelect } = this.props;

        if (onSelect) {
            onSelect();
        }
    }

    _onTmpUserChanged(name: string, value: string) {
        const { onTmpUserChanged, userRequest } = this.props;

        if (userRequest && onTmpUserChanged) {
            const { id } = userRequest;
            if (!id) return;

            onTmpUserChanged(id, name, value);
        }
    }

    _onAccept() {
        const { onAcceptUserRequest, userRequest } = this.props;

        this.setState({
            ...this.state,
            isUpdating: true,
        })

        if (userRequest) {
            const { id } = userRequest;
            if (!id) return;

            if (onAcceptUserRequest) {
                onAcceptUserRequest(id);
            }
        }
    }

    _onDecline() {
        const { onDeclineUserRequest, userRequest } = this.props;

        this.setState({
            ...this.state,
            isUpdating: true,
        })

        if (userRequest) {
            const { id } = userRequest;
            if (!id) return;

            if (onDeclineUserRequest) {
                onDeclineUserRequest(id);
            }
        }
    }

    render() {
        const { userRequest, roles, selected, tmpUser } = this.props;

        let isUpdating = userRequest?.isUpdating;

        let cn = "user-request-header p-3 d-flex align-items-center justify-content-between position-relative";

        const originalValue = userRequest ? userRequest.role : '';
        const editValue = tmpUser ? tmpUser["role"] : '';

        let roleId = editValue ? editValue : originalValue;

        let roleTitle = '';
        if (roleId) {
            if (roles && roles[roleId]) {
                roleTitle = roles[roleId].title;
            }
            else {
                roleTitle = roleId;
            }
        }

        // let durationTitle = userRequest?.duration || '';

        return (
            <Card className={'user-request flex-column justify-content-start header-4 align-items-stretch'}
                  header={
                      <div onClick={() => this._onToggleSelected()} className={cn}>
                          <div className={'d-flex h-gap-4 px-5 py-4'}>
                              <div className={'header-1 font-weight-semi-bold'}>Request: {userRequest?.first_name + (userRequest?.last_name ? " " + userRequest?.last_name : "")}</div>
                          </div>
                          {
                              isUpdating &&
                              <LoadingIndicator size={Size.small} className={"loading position-absolute"}/>
                          }
                      </div>
                  }
                  body={
                      <div className={'p-3'}>
                          {/*<div className={'request-info-grid'}>*/}
                          {/*    <div className={'header-2 text-right'}>Role:</div>*/}
                          {/*    <div className={'header-2 text-right text-wrap'}>Reason for Authentication:</div>*/}
                          {/*    <div className={'d-flex justify-content-between'}>*/}
                          {/*        <ComboBox title={roleTitle} disable={true}/>*/}
                          {/*        <div className={'header-2 text-accent'}>for</div>*/}
                          {/*        <ComboBox title={durationTitle} disable={true}/>*/}
                          {/*    </div>*/}
                          {/*    <div className={'header-1 font-italic font-weight-light text-info'}>{userRequest?.comment}</div>*/}
                          {/*</div>*/}

                          <div className={'pending-user-grid'}>
                              <div className={'header-1 font-weight-semi-bold align-self-center justify-self-end'}>Email:</div>
                              <div className={'header-1 font-weight-semi-bold align-self-center justify-self-end'}>Phone:</div>
                              <div className={'header-1 font-weight-semi-bold align-self-center justify-self-end'}>Role:</div>
                              <div className={'header-1 font-weight-semi-bold align-self-center justify-self-end text-wrap text-right'}>Reason for Authentication:</div>
                              <div className={'header-1 font-weight-semi-bold align-self-center'}>{userRequest?.email_address}</div>
                              <div className={'header-1 font-weight-semi-bold align-self-center'}>{userRequest?.phone_number}</div>
                              <ComboBox
                                  className={"align-self-center"}
                                  onSelect={(value: string) => this._onTmpUserChanged("role", value)}
                                  title={roleTitle}
                                  items={roles}
                                  disable={isUpdating}
                              />
                              <div className={'header-1 font-weight-semi-bold align-self-center justify-self-end text-wrap font-italic text-info'}>{userRequest?.registration_reason}</div>
                          </div>
                          <div className={"d-flex pt-2"}>

                          </div>

                          <div className={"d-flex flex-fill justify-content-between"}>
                              {/*<div className={"d-flex info-button justify-content-start"}>*/}
                              {/*    <div className={'d-flex h-gap-3 align-items-center'}>*/}
                              {/*        <InfoSVG className={'small-image-container'}/>*/}
                              {/*        <div className={'header-2'}>More Info</div>*/}
                              {/*    </div>*/}
                              {/*</div>*/}
                              <div className={'d-flex flex-fill h-gap-2 justify-content-end'}>
                                  <Button
                                      text={"Decline"}
                                      highlight={true}
                                      orientation={"horizontal"}
                                      onClick={() => this._onDecline()}
                                      selected={false}
                                      disabled={isUpdating}
                                      className={"px-5"}/>
                                  <Button
                                      text={"Accept"}
                                      orientation={"horizontal"}
                                      onClick={() => this._onAccept()}
                                      selected={false}
                                      disabled={isUpdating}
                                      className={"px-5"}/>
                              </div>

                          </div>
                      </div>
                  }
                  selected={selected}
            />
        );
    }
}
