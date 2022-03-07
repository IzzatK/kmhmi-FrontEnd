import React, {Component} from "react";

import {IWrapper} from "../../framework.visual.api";
import {IPresenter} from "../../framework.visual.api";
import {IController} from "../../framework.visual.api";

export abstract class Wrapper<WrapperProps, WrapperState extends {viewModel?: ViewModel, viewController?: ViewController}, ViewModel, ViewController, ViewProps>
    extends Component<WrapperProps, WrapperState> implements IWrapper<WrapperProps, WrapperState, ViewProps> {

    private presenter!: IPresenter<WrapperProps, WrapperState, ViewModel>;
    abstract presenterSupplier: {new(props: WrapperProps, state: WrapperState): IPresenter<WrapperProps, WrapperState, ViewModel>};

    private controller!: IController<WrapperProps, WrapperState, ViewController>;
    abstract controllerSupplier: {new(props: WrapperProps, state: WrapperState, setState: (state:WrapperState, callback: any) => void): IController<WrapperProps, WrapperState, ViewController> };

    abstract getView(): React.ElementType<ViewProps>;

    getPresenter() {
        return this.presenter;
    }

    getController() {
        return this.controller;
    }

    componentDidMount() {
        // initiate any remote data source fetching
        this.presenter = new this.presenterSupplier(this.props, this.state);
        this.controller = new this.controllerSupplier(this.props, this.state, (state, callback) => this.setState(state, callback));

        this.handlePropertyChanged();
    }

    componentDidUpdate(prevProps: Readonly<WrapperProps>, prevState: Readonly<WrapperState>) {
        this.handlePropertyChanged(prevProps, prevState);
    }

    handlePropertyChanged(prevProps?: Readonly<WrapperProps>, prevState?: Readonly<WrapperState>) {
        let dirty = false;

        let viewModel = this.presenter.computeViewModel(this.props, this.state, prevProps, prevState);
        if (viewModel != prevState?.viewModel) {
            dirty = true;
        }

        let viewController = this.controller.computeEventHandlers(this.props, this.state, prevProps, prevState);
        if (viewController != prevState?.viewController) {
            dirty = true;
        }

        if (dirty) {
            this.setState({
                ...this.state,
                viewModel,
                viewController
            })
        }
    }
}