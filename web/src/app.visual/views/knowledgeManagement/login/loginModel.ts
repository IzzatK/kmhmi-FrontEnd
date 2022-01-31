export type LoginStateProps = {
    className?: string;
}

export type LoginDispatchProps = {

}

export type LoginProps = LoginStateProps & LoginDispatchProps;

export type LoginState = {
    loading: boolean
}
