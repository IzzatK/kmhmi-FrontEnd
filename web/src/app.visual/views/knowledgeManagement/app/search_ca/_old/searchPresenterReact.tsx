export {};
// import React, {Component} from "react";
// import {SearchProps, SearchState} from "./searchModel";
// import {Nullable} from "../../../../../framework/extras/typeUtils";
// import {IPresenterReact} from "../../../../../framework.visual.api/iPresenterReact";
//
//
// export class SearchPresenterReact extends Component<SearchProps, SearchState> implements IPresenterReact<SearchProps, SearchState> {
//
//
//     constructor(props: SearchProps, state: Readonly<SearchState>) {
//         super(props);
//
//         this.onPropertyChanged();
//     }
//
//     componentDidUpdate(prevProps: Readonly<SearchProps>, prevState: Readonly<SearchState>, snapshot?: any) {
//         this.onPropertyChanged(prevProps, prevState);
//     }
//
//     onPropertyChanged(prevProps?: Readonly<SearchProps>, prevState?: Readonly<SearchState>) {
//         //compute the view model based on the new props
//         let nextState:Nullable<SearchState> = null;
//
//         // if props updated, then calculate
//         if (prevProps != this.props) {
//             nextState = {...this.state};
//             // compute the next state
//         }
//
//         if (prevState != this.state || nextState != this.state) {
//             if (nextState == null) {
//                 nextState = {...this.state};
//             }
//
//             // some computational fields may need to be updated
//         }
//
//         if (nextState != null) {
//             this.setState(nextState);
//         }
//     }
//
//     render() {
//         const { className, toolsVisible } = this.state;
//         const { viewSupplier } = this.props;
//
//         const View = viewSupplier();
//
//         return <View className={""} toolsVisible={false}/>
//     }
// }
