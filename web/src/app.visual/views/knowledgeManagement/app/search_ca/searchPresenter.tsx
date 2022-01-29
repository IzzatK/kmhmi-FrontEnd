import React, {Component} from "react";
import {SearchAppModel, SearchViewModel} from "./searchModel";
import {Nullable} from "../../../../../framework/extras/typeUtils";


export class SearchPresenter extends Component<SearchAppModel, SearchViewModel> {

    constructor(props: SearchAppModel) {
        super(props);

        this.updateState();
    }

    componentDidUpdate(prevProps: Readonly<SearchAppModel>, prevState: Readonly<SearchViewModel>, snapshot?: any) {
        this.updateState(prevProps, prevState);
    }

    updateState(prevProps?: Readonly<SearchAppModel>, prevState?: Readonly<SearchViewModel>) {
        //compute the view model based on the new props
        let nextState:Nullable<SearchViewModel> = null;

        // if props updated, then calculate
        if (prevProps != this.props) {
            nextState = {...this.state};
            // compute the next state
        }

        if (prevState != this.state || nextState != this.state) {
            if (nextState == null) {
                nextState = {...this.state};
            }

            // some computational fields may need to be updated
        }

        if (nextState != null) {
            this.setState(nextState);
        }
    }

    render() {
        // props do not belong in the render method
        const { className, toolsVisible } = this.state;
        const {viewSupplier} = this.props;

        const View = viewSupplier();

        return <View className={""} toolsVisible={false}/>
    }
}
