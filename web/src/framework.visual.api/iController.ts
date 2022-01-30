export interface IController<AppProps, AppState, Output> {
    computeEventHandlers(props: AppProps, state: AppState, prevProps?: AppProps, prevState?: AppState): Output;
}