export interface IPresenter<AppProps, AppState, Output> {
    computeViewModel(props: AppProps, state: AppState, prevProps?: AppProps, prevState?: AppState): Output;
}