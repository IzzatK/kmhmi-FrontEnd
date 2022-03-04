import React, {Component} from "react";
import {PositioningPortal} from "@codastic/react-positioning-portal/lib";
import {bindInstanceMethods} from "../../../../framework.core/extras/typeUtils";
import {PortalProps, PortalState} from "./portalModel";

class Portal extends Component<PortalProps, PortalState> {

    timeout = null;
    private didChangeTimeout: NodeJS.Timeout | undefined;

    constructor(props: PortalProps | Readonly<PortalProps>) {
        super(props);
        this.state = {
            isOpen: false,
            willChangeTo: null,
        }

        bindInstanceMethods(this);
    }

    componentDidMount() {
        const { isOpen } = this.props;

        if (isOpen) {
            this._open();
        }
    }

    componentDidUpdate(prevProps: Readonly<PortalProps>, prevState: Readonly<PortalState>, snapshot?: any) {
        const { isOpen } = this.props;

        if (isOpen && !prevProps.isOpen) {
            this._open();
        } else if (!isOpen && prevProps.isOpen) {
            this._close();
        }
    }

    _onShouldClose = () => {
        const { onShouldClose } = this.props;
        const { isOpen }  = this.state;

        if (isOpen) {
            this._close();
        }

        if (onShouldClose) {
            onShouldClose();
        }
    };

    _open() {
        this._cancelQueue();

        const { enterClass='', timeout=0 } = this.props;

        // Force a reflow, so that a transition will be rendered
        // between the initial state, and the state that results
        // from setting `willChangeTo = "open"`.
        // this.node && this.node.scrollTop;

        this.setState({
            willChangeTo: enterClass,
            isOpen: true
        }, () => {
            setTimeout(() => {
                this.setState({
                    willChangeTo: `${enterClass}-active`,
                    isOpen: true
                });
            }, 1)
        });


        this.didChangeTimeout = setTimeout(() => {
            this.setState({
                isOpen: true,
                willChangeTo: null,
            });
            delete this.didChangeTimeout;
        }, timeout);
    }

    _close() {
        this._cancelQueue();

        const { exitClass='', timeout=0 } = this.props;

        this.setState({
            isOpen: true,
            willChangeTo: exitClass
        }, () => {
            this.setState({
                isOpen: true,
                willChangeTo: `${exitClass}-active`,
            });
        });

        this.didChangeTimeout = setTimeout(() => {
            this.setState({
                isOpen: false,
                willChangeTo: null,
            });
            delete this.didChangeTimeout;
        }, timeout);
    }

    _cancelQueue() {
        if (this.didChangeTimeout) {
            clearTimeout(this.didChangeTimeout);
            delete this.didChangeTimeout;
        }
    }


    render() {
        const { className, children,
                onShouldClose, portalContent, zIndex=99,
                autoLayout = true, ...rest
        } = this.props;

        const { isOpen, willChangeTo=null } = this.state;

        let cn = `portal position-absolute ${willChangeTo ? willChangeTo : ''}`;
        if (className) {
            cn += ` ${className}`;
        }

        return (
            <PositioningPortal
                isOpen={isOpen}
                onShouldClose={this._onShouldClose}
                portalContent={({ relatedWidth }) => {
                    return (
                        autoLayout ?
                            <div {...rest} className={cn} style={{minWidth: relatedWidth, zIndex: zIndex}}>
                                {portalContent}
                            </div> :
                            <div {...rest} className={cn} style={{zIndex: zIndex}}>
                                {portalContent({relatedWidth})}
                            </div>
                    );
                }}
            >
                {children}
            </PositioningPortal>
        );
    }
}

export default Portal;
