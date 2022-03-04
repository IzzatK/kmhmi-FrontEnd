import {bindActionCreators} from "redux";
import {makeGuid} from "./utils/uniqueIdUtils";
import {bindInstanceMethods, Nullable} from "../../framework.core/extras/typeUtils";
import {SliceCaseReducers} from "@reduxjs/toolkit/src/createSlice";
import {Slice} from "@reduxjs/toolkit";


export class Presenter<SliceState=null, CaseReducers extends SliceCaseReducers<SliceState> = {}> {
    _mapStateToProps?: (state: any, props: any) => any;
    _mapDispatchToProps?: (state: any, props: any) => any;
    _view: any = null;
    _id: any = null;
    _model: Slice<SliceState, CaseReducers> | null = null;
    _displayOptions: any = null;
    _metadataId: any = null;

    constructor() {
        this.id = makeGuid();

        this.view = null;

        // EXAMPLE MODEL
        // super.model = createSlice({
        //     name: this.id,
        //     initialState: {
        //
        //     },
        //     reducers: {
        //
        //     }
        // });

        // this.displayOptions = {
        //     containerId: '',
        //     visible: true,
        //     appearClass: '',
        //     enterClass: '',
        //     exitClass: '',
        //     timeout: 300
        // };

        // EXAMPLE MAP STATE TO PROPS
        // super.mapStateToProps = (state, props) => {
        //     return {
        //         propValue: state[this.id].propValue
        //     }
        // }
        //
        // super.mapDispatchToProps = (dispatch) => {
        //     return {
        //         onAction: (arg) => dispatch(this.onAction(arg))
        //     };
        // }

        bindInstanceMethods(this);
    }

    createMapDispatchToProps(dispatch: any, dispatchActions: any={}) {
        if (!dispatch || dispatchActions.length === 0) return null;

        return {
            ...bindActionCreators(
                {
                    ...dispatchActions
                },
                dispatch,
            ),
        };
    };


    get mapStateToProps() {
        return this._mapStateToProps;
    }

    set mapStateToProps(value) {
        this._mapStateToProps = value;
    }

    get mapDispatchToProps() {
        return this._mapDispatchToProps;
    }

    set mapDispatchToProps(value) {
        this._mapDispatchToProps = value;
    }

    get view() {
        return this._view;
    }

    set view(value) {
        this._view = value;
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get model() {
        return this._model;
    }

    set model(value) {
        this._model = value;
    }

    get displayOptions() {
        return this._displayOptions;
    }

    set displayOptions(value) {
        let result = {
            ...this._displayOptions,
            ...value
        }

        this._displayOptions = result;
    }

    get metadataId() {
        return this._metadataId;
    }

    set metadataId(value) {
        this._metadataId = value;
    }

    getPersistentState(state: any): Nullable<SliceState> {

        let result: Nullable<SliceState> = null;

        if (this.model != null) {
            result = state[this.model.name];
        }

        return result;
    }
}
