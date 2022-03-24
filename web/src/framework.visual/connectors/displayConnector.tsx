import React, {Component} from "react";
import {connect} from "react-redux";
import {getClassNames} from "../extras/utils/animationUtils";
import {CSSTransition} from "react-transition-group";
import {displayService} from "../../serviceComposition";

type Props = {
    visible: boolean;
    appearClass: string;
    enterClass: string;
    exitClass: string;
    timeout: number;
}

type State = {

}

export const createDisplayConnector = (WrappedComponent: any, viewId: string) => {
    class DisplayWrapper extends Component<Props, State> {

        constructor(props: any) {
            super(props);
        }

        render() {
            const { visible, appearClass, enterClass, exitClass, timeout=0, ...rest } = this.props;
            const classNames = getClassNames(appearClass, enterClass, exitClass);

            let timeoutResult = timeout;
            if (!visible) {
                if (exitClass === '') timeoutResult = 0;
            }
            else {
                if (enterClass === '') timeoutResult = 0;
            }

            return (
                <CSSTransition in={visible} appear={appearClass !== ''} timeout={timeoutResult} classNames={classNames} unmountOnExit={true} >
                    <WrappedComponent {...rest} />
                </CSSTransition>

            );
        }
    }

    // If the mapStateToProps argument supplied to connect returns a function instead of an object,
    // it will be used to create an individual mapStateToProps function for each instance of the container.
    const mapStateToProps = (state: any) => {
        let viewInfo = displayService.getNodeInfo(viewId);

        return {
            visible: viewInfo ? viewInfo.visible : true,
            appearClass: viewInfo.appearClass,
            enterClass: viewInfo.enterClass,
            exitClass: viewInfo.exitClass,
            timeout: viewInfo.timeout,
        }
    };

    return connect(mapStateToProps, {})(DisplayWrapper);
};
