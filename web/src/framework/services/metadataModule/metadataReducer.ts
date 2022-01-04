import {createAction} from "@reduxjs/toolkit";

export const makeMetadata = (baseType: string) => {
    const actions = {
        START: createAction(`${baseType}/start`, (payload) => {return {payload}}),
        SUCCESS:  createAction(`${baseType}/success`, (payload) => {return {payload}}),
        ERROR: createAction(`${baseType}/error`, (payload) => {return {payload}}),
    };

    const reducers = {
        [actions.START.type]: (state: any, action: any) => {
            state[baseType].loading = true;
        },
        [actions.SUCCESS.type]: (state: any, action: any) => {
            state[baseType].data = action.payload;
            state[baseType].lastFetch = Date.now();
            state[baseType].error = null;
            state[baseType].lastError = null;
            state[baseType].loading = false;
        },
        [actions.ERROR.type]: (state: any, action: any) => {
            state[baseType].lastError = Date.now();
            state[baseType].error = action.payload;
            state[baseType].loading = false;
        }
    };

    const initialState = {
        data: null,
        lastError: null,
        error: null,
        lastFetch: null,
        loading: false
    };

    return {
        actions,
        reducers,
        initialState
    }
};
