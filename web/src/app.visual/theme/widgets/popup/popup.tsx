import React, {Component} from "react";
import './popup.css';
import {PopupProps, PopupState} from "./popupModel";
import {bindInstanceMethods} from "../../../../framework/extras/typeUtils";
import Button from "../button/button";
import {DeleteSVG} from "../../svgs/deleteSVG";

class Popup extends Component<PopupProps, PopupState> {
    constructor(props: PopupProps | Readonly<PopupProps>) {
        super(props);

        bindInstanceMethods(this);
    }

    componentDidMount() {
    }

    componentDidUpdate(prevProps: Readonly<PopupProps>, prevState: Readonly<PopupState>, snapshot?: any) {
    }

    _onCancel() {
        const { onCancel } = this.props;

        if (onCancel) {
            onCancel();
        }
    }

    _onProceed() {
        const { onProceed } = this.props;

        if (onProceed) {
            onProceed();
        }
    }

    render() {
        const { className, graphic:Graphic, text, cancelText, proceedText, padding, isVisible, children } = this.props

        let cn = `popup ${isVisible ? "d-flex" : "d-none"} position-fixed w-100 h-100 overflow-auto m-auto`;
        if (className) {
            cn += ` ${className}`;
        }

        return (
            <div className={cn}>
                <div className={`popup-content d-flex flex-column justify-content-center align-items-center rounded-lg shadow pt-3 pb-4 px-5 position-relative display-4 ${children ? "" : "v-gap-4"}`}>
                    <div className={"position-absolute close"}>
                        <Button className={"btn-transparent"} onClick={() => this._onCancel()}>
                            <DeleteSVG className={"nano-image-container"}/>
                        </Button>

                    </div>
                    {
                        children ? children :
                            <div className={"d-flex flex-column justify-content-center align-items-center v-gap-4"}>
                                {
                                    Graphic &&
                                    <Graphic className={"graphic large-image-container"}/>
                                }
                                <div className={"text-center text-wrap"}>{text}</div>

                                <div className={"v-gap-2"}>
                                    <Button className={"option"} text={proceedText} light={true} onClick={() => this._onProceed()}/>
                                    <Button className={"option"} text={cancelText} light={true} highlight={true} onClick={() => this._onCancel()}/>
                                </div>
                            </div>
                    }
                </div>
            </div>
        );
    }
}

export default Popup;
