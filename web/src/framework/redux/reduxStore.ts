import {Action, configureStore, PayloadAction, SliceCaseReducers, ThunkDispatch, Unsubscribe} from '@reduxjs/toolkit'
import thunk from "redux-thunk";
import config from "../../app.config/config";
import {combineReducers} from "redux";
import {bindInstanceMethods} from "../extras/typeUtils";
import {IStorage} from "../../framework.api";


function root(state = config, action: PayloadAction) {
    return state;
}

const store = configureStore({
    reducer: root,
    middleware: [thunk]
});

// type EnhancedStore = typeof store;
// // Infer the `RootState` and `AppDispatch` types from the redux itself
// export type RootState = ReturnType<typeof store.getState>
// // Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
// export type AppDispatch = typeof store.dispatch
// export type AppAsyncDispatch = ThunkDispatch<RootState, void, Action>;


export class AppDataStore implements IStorage {
    dynamicReducers: Record<string, SliceCaseReducers<any>> = {};

    constructor() {
        bindInstanceMethods(this);
    }

    addEventHandlers(key: string, reducers: SliceCaseReducers<any>) {
        this.dynamicReducers[key] = reducers;
        let nextReducers = this.combiner(this.dynamicReducers);
        store.replaceReducer(nextReducers);
    }

    private combiner(reducers: any): any {
        let dynamicReducers = {root};
        Object.assign(dynamicReducers, reducers);
        return combineReducers(dynamicReducers)
    }

    sendEvent(action: PayloadAction) {
        store.dispatch(action);
    }

    getState(): any {
        return store.getState();
    }

    getStorage(): any {
        return store;
    }

    sendEventAsync(action: any): (dispatch: any) => void {
        return store.dispatch(action);
    }

    subscribe(listener: () => void) {
        store.subscribe(listener);
    }
    unsubscribe(listener: Unsubscribe) {
        store.subscribe(listener);
    }
}
