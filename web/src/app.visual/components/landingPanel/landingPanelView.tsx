import React, {Component} from "react";
import './landingPanel.css';
import {LandingPanelProps, LandingPanelState} from "./landingPanelModel";
import {RegistrationStatusType} from "../../model/registrationStatusType";

class LandingPanelView extends Component<LandingPanelProps, LandingPanelState> {
    render() {
        const { className, user, registrationStatus } = this.props;

        let cn = 'landing-panel d-flex flex-fill justify-content-center align-items-center';
        if (className) {
            cn += ` ${className}`;
        }

        return (
            <div className={cn}>
                <div className={"d-flex flex-column flex-fill position-relative h-100"}>
                    <div className={'d-flex flex-fill flex-column justify-content-center align-items-center v-gap-5'} style={{zIndex: 999}}>
                        {/*<div className={'d-flex align-items-center justify-content-center'}>*/}
                        {/*    <div className={'display-1 text-secondary'}>*/}
                        {/*        {`Welcome, ${user.first_name} ${user.last_name}`}*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                        {
                            registrationStatus === RegistrationStatusType.CREATED &&
                            <div className={"popup v-gap-5 w-33"}>
                                <div className={"text-selected font-weight-semi-bold px-5 pt-5"}>
                                    <div className={"d-flex justify-content-center mt-5 pt-5"}>Your Authorization is Pending...</div>
                                </div>

                                <div className={"d-flex flex-column justify-content-center align-items-center v-gap-5 px-5 mx-5"}>
                                    {
                                        <div className={"d-flex flex-column justify-content-center align-items-center v-gap-5"}>
                                            <div className={"text-info font-weight-light display-3 pt-5"}>An admin needs to authorize you in order to access CIC Knowledge Management</div>
                                        </div>
                                    }
                                    <div className={"text-info font-weight-light display-3 pt-5"}>Please check back once your authorization has been approved.</div>
                                </div>
                            </div>
                        }
                        {
                            registrationStatus === RegistrationStatusType.REJECTED &&
                            <div className={'d-flex align-items-center justify-content-center'}>
                                <div className={'display-1 text-secondary'}>You have been rejected from the Jedi Order</div>
                            </div>
                        }
                        {
                            registrationStatus === RegistrationStatusType.NONE &&
                            <div className={'d-flex align-items-center justify-content-center'}>
                                <div className={'display-1 text-secondary'}>Unable to retrieve account status</div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default LandingPanelView;
