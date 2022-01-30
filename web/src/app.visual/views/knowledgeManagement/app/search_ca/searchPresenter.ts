import {SearchViewModel, SearchWrapperProps, SearchWrapperState} from "./searchModel";
import {IPresenter} from "../../../../../framework.visual.api/iPresenter";
import {bool} from "prop-types";


export class SearchPresenter implements IPresenter<SearchWrapperProps, SearchWrapperState, SearchViewModel>{
    props: SearchWrapperProps;
    state: SearchWrapperState;

    viewModel: SearchViewModel;

    constructor(props: SearchWrapperProps, state: SearchWrapperState) {
        this.props = props;
        this.state = state;

        this.viewModel = {
            user: null,
            counter: this.pad(`${state.counter}`, 10)
        }
    }

    pad(num: string, size: number) {
        num = num.toString();
        while (num.length < size) num = "0" + num;
        return num;
    }

    computeViewModel(props: SearchWrapperProps, state: SearchWrapperState, prevProps?: SearchWrapperProps, prevState?: SearchWrapperState): SearchViewModel {
        this.props = props;
        this.state = state;

        if (state != prevState) {
            if (state.counter != prevState?.counter) {
                this.viewModel.counter = this.pad(`${state.counter}`, 10)
            }
        }

        return this.viewModel;
    }
}