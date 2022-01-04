// import React from 'react';
// import './landing.css';
// import NotificationPanelPresenter from "../../components/notificationPanel/notificationPanelPresenter";
// import NotificationDockPresenter from "../../components/notificationDock/notificationDockPresenter";
// import createComponentWrapper from "../../components/extras/ComponentWrapper";
// import {connect} from "react-redux";
// import StatusBannerView from "../../components/statusBanner/statusBannerView";
// import {COMPONENT_NAME} from "../../components/statusBanner/statusBannerPresenter";
// import {CSSTransition} from "react-transition-group";
// import {getClassNames} from "../../framework/utils/animationUtils";
// import LogService from "../../application/app/LogService";
// import SettingsPanelPresenter from "../../components/displayPanels/settingsPanel/settingsPanelPresenter";
//
// class LoginView extends React.Component {
//
//     // constructor(props) {
//     //     super(props);
//     //
//     //     this.state = {
//     //         hasAlerts: false
//     //     }
//     // }
//     //
//     // componentDidMount() {
//     //     setInterval(() => {
//     //         this.setState({
//     //             hasAlerts: !this.state.hasAlerts
//     //         })
//     //     }, 5000)
//     // }
//
//     render() {
//         const { hasAlerts } = this.props;
//
//         const classNames = getClassNames('slideLeftIn', 'slideLeftIn', 'slideRightOut');
//
//         return (
//             <div id={"landing-view"} className={"flex-fill d-flex flex-column bumed-landing-background"}>
//                 <div className={"d-flex flex-fill justify-content-end align-items-stretch"}>
//                     <div className={"d-flex flex-fill justify-content-center align-items-stretch"}>
//                         <div className={"position-relative"}>
//                         </div>
//                         <div className={"flex-fill d-flex flex-column"}>
//                             <div className={"d-flex flex-fill justify-content-center align-items-center position-relative overflow-hidden"}>
//                                 <SettingsPanelPresenter className={'mush'} />
//                             </div>
//                         </div>
//                         <CSSTransition in={hasAlerts} timeout={300} classNames={classNames} unmountOnExit={true}>
//                             <div className={"position-relative"}>
//                                 <NotificationDockPresenter className={'py-2'}/>
//                                 <NotificationPanelPresenter showTitle={true}/>
//                             </div>
//                         </CSSTransition>
//                     </div>
//                 </div>
//             </div>
//         );
//     }
// }
//
// const displayOptions = {
//     containerId: 'bumed',
//     visible: false,
//     appearClass: '',
//     enterClass: '',
//     exitClass: '',
//     timeout: 0
// }
//
// export const VIEW_NAME = "landing-view";
//
// const mapStateToProps = (state) => {
//     return {
//         hasAlerts: LogService.getAlerts().length > 0
//     }
// }
//
// const Login = connect(
//     mapStateToProps
// )(createComponentWrapper(LoginView,VIEW_NAME, {}, {}, displayOptions));
//
// export default Login;
