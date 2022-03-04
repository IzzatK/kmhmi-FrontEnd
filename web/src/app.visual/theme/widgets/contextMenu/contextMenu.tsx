import React, {Component, createRef} from "react";
import './contextMenu.css';
import {ContextMenuProps, ContextMenuState} from "./contextMenuModel";
import {bindInstanceMethods} from "../../../../framework.core/extras/typeUtils";

class ContextMenu extends Component<ContextMenuProps, ContextMenuState> {
    private readonly contextRef: { current: any };

    constructor(props: any) {
        super(props);

        bindInstanceMethods(this);

        this.state = {
            visible: false,
            posX: 0,
            posY:0,
        }

        this.contextRef = createRef();
    }

    _setContextData(visible?: boolean, posX?: number, posY?: number) {
        const { visible: oldVisible, posX: oldPosX, posY: oldPosY } = this.state;

        let newPosX = posX ? posX : oldPosX;

        let newPosY = posY ? posY : oldPosY;

        if (newPosX + this.contextRef.current?.offsetWidth > window.innerWidth) {
            newPosX = newPosX - this.contextRef.current?.offsetWidth;
        }

        if (newPosY + this.contextRef.current?.offsetHeight > window.innerHeight) {
            newPosY = newPosY - this.contextRef.current?.offsetHeight;
        }

        this.setState({
            ...this.state,
            visible: visible !== undefined ? visible : oldVisible,
            posX: newPosX,
            posY: newPosY,
        })
    }

    _contextMenuEventHandler(event: any, targetId: string) {
        const targetElement = document.getElementById(targetId)

        if (targetElement && targetElement.contains(event.target)) {
            event.preventDefault();
            this._setContextData(true, event.clientX - event.currentTarget.clientWidth, event.clientY - event.currentTarget.clientHeight)
        } else if (this.contextRef?.current && !this.contextRef.current.contains(event.target)) {
            this._setContextData(false)
        }
    }

    _offClickHandler(event: any) {
        if (this.contextRef?.current) {
            if (this.contextRef.current && !this.contextRef.current.contains(event.target)) {
                this._setContextData(false)
            }
        }
    }

    componentDidUpdate(prevProps: Readonly<ContextMenuProps>, prevState: Readonly<ContextMenuState>, snapshot?: any) {
        const { targetId } = this.props;

        if (targetId !== prevProps.targetId) {
            document.getElementById(targetId)?.removeEventListener('contextmenu', (event) => this._contextMenuEventHandler(event, targetId))
            document.getElementById(targetId)?.removeEventListener('click', (event) => this._offClickHandler(event));

            document.getElementById(targetId)?.addEventListener('contextmenu', (event) => this._contextMenuEventHandler(event, targetId))
            document.getElementById(targetId)?.addEventListener('click', (event) => this._offClickHandler(event));
        }
    }

    componentDidMount() {
        const { targetId } = this.props;

        document.getElementById(targetId)?.addEventListener('contextmenu', (event) => this._contextMenuEventHandler(event, targetId))
        document.getElementById(targetId)?.addEventListener('click', (event) => this._offClickHandler(event));
    }

    componentWillUnmount() {
        const { targetId } = this.props;

        document.getElementById(targetId)?.removeEventListener('contextmenu', (event) => this._contextMenuEventHandler(event, targetId))
        document.getElementById(targetId)?.removeEventListener('click', (event) => this._offClickHandler(event));
    }

    render() {
        const { className, children } = this.props;
        const { visible , posX, posY } = this.state;

        let cn = "context-menu flex-column justify-content-center align-items-center position-absolute";
        if (className) {
            cn += ` ${className}`;
        }
        if (!visible) {
            cn += ` d-none`;
        }

        return (
            <div className={cn} ref={this.contextRef} style={{left: posX, top: posY }}>
                {children}
            </div>
        );
    }
}

export default ContextMenu;
