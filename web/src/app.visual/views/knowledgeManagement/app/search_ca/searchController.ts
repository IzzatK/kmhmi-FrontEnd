import {SearchViewController, SearchWrapperProps, SearchWrapperState} from "./searchModel";
import {makeGuid} from "../../../../../framework.visual/extras/utils/uniqueIdUtils";
import {UserInfo} from "../../../../../app.model";
import {IController} from "../../../../../framework.visual.api/iController";


export class SearchController implements IController<SearchWrapperProps, SearchWrapperState, SearchViewController> {
    props: SearchWrapperProps;
    state: SearchWrapperState;

    viewController: SearchViewController;

    onStateChange: (state: SearchWrapperState, callback?: any) => void;

    constructor(props: SearchWrapperProps, state: SearchWrapperState, onStateChange: (state:SearchWrapperState, callback?: any) => void) {
        this.props = props;
        this.state = state;
        this.onStateChange = onStateChange;

        this.viewController = {
            onUserUpdated: (name, value) => this.updateUser(name, value)
        }
    }

    computeEventHandlers(props: SearchWrapperProps, state: SearchWrapperState, prevProps?: SearchWrapperProps, prevState?: SearchWrapperState) : SearchViewController {
        this.props = props;
        this.state = state;

        return this.viewController;
    }

    updateUser(name: string, value: string) {
        const nextUser = {
            ...this.state.viewModel?.user
        };

        nextUser[name] = value;

        // convert from view object to domain object

        let nextState = {
            ...this.state,
            nextUser
        }

        // can choose to keep this local
        // this.onStateChange(nextState);

        // or to send it out
        // this.props.updateUser(new UserInfo(makeGuid()));
    }
}