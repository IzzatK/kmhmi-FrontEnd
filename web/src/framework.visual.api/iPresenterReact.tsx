export interface IPresenterReact<AppModel, ViewModel> {
    onPropertyChanged(prevProps?: Readonly<AppModel>, prevState?: Readonly<ViewModel>): void;
    componentDidUpdate(prevProps: Readonly<AppModel>, prevState: Readonly<ViewModel>, snapshot?: any): void;
}