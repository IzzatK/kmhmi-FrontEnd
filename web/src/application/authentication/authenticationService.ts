import Keycloak from "keycloak-js";
import {keycloakConfig, keycloakEnabled} from "../../config/config";
import {IAuthenticationService, IUserService} from "../../api";
import {Nullable} from "../../framework/extras/typeUtils";
import {IStorage} from "../../framework/api";
import {Plugin} from "../../framework/extras/plugin";
import {createSlice, PayloadAction, Slice} from "@reduxjs/toolkit";

type AuthenticationProfile = {
    id: string,
    username: string,
    firstName: string,
    lastName: string,
    email: string
}

type AuthenticationState = {
    hasError: boolean;
    profile: AuthenticationProfile,
    userId: string
}

type AuthenticationSliceType = Slice<AuthenticationState,
    {
        setHasError: (state: AuthenticationState, action: PayloadAction<boolean>) => void;
        setProfile: (state:AuthenticationState, action:PayloadAction<AuthenticationProfile>) => void;
    }>;

export class AuthenticationService extends Plugin implements IAuthenticationService {
    public static readonly class:string = 'AuthenticationService';
    private appDataStore: Nullable<IStorage> = null;
    private userService: Nullable<IUserService> = null;

    private _kc: any;
    private readonly REDIRECT_URI: string;
    private readonly loginOptions: any;
    private readonly logoutOptions: any;

    private model: AuthenticationSliceType;

    constructor() {
        super();
        this.appendClassName(AuthenticationService.class);

        this._kc = Keycloak(keycloakConfig);
        this.REDIRECT_URI = '';
        this.loginOptions = {};
        this.logoutOptions = { redirectUri : this.REDIRECT_URI };

        this.model = createSlice({
            name: 'application/authentication',
            initialState: {
                hasError: false,
                profile: {
                    id: '',
                    username: '',
                    firstName: '',
                    lastName: '',
                    email: ''
                },
            } as AuthenticationState,
            reducers: {
                setHasError: (state, action) => {
                    state.hasError = action.payload;
                },
                setProfile: (state, action) => {
                    state.profile = {
                        id: action.payload.id,
                        username: action.payload.username,
                        firstName: action.payload.firstName,
                        lastName: action.payload.lastName,
                        email: action.payload.email,
                    };
                },
            },
        });
    }

    start() {
        super.start();

        this.appDataStore?.addEventHandlers(this.model.name, this.model.reducer);
    }

    stop() {
        super.stop();
    }

    configure() {
        super.configure();
    }

    setAppDataStore(appDataStore: IStorage) {
        this.appDataStore = appDataStore;
    }

    setUserService(userService: IUserService) {
        this.userService = userService;
    }

    initKeycloak(onAuthenticatedCallback: any, onRegisterCallback: any) {
        this._kc.init({onLoad: 'login-required'})
            .then((authenticated: any) => {
                if (authenticated) {
                    //Authentication was successful, retrieve the user info
                    this._kc.loadUserProfile()
                        .then(() => {

                            const userId = this._kc.profile?.id;

                            this.appDataStore?.sendEvent(this.model.actions.setProfile(this._kc.profile));

                            if (this.userService) {
                                this.userService.setCurrentUser(userId);
                            }

                            console.log(JSON.stringify(this._kc.profile));
                            onAuthenticatedCallback();
                        })
                        .catch(() => {
                            this.onError('No longer authenticated: Invalid Certificate\n')
                        })
                } else {
                    this.onError('Not authenticated');
                    onRegisterCallback();
                }

            })
            .catch((ex: any) => {
                this.onError('Failed to authenticate with keycloak: \n' + JSON.stringify(ex));
            })
    }

    doLogin() {
        return this._kc.login(this.loginOptions);
    }

    doLogout() {
        return this._kc.logout(this.logoutOptions);
    }

    getToken() {
        return this._kc.token || '';
    }

    isLoggedIn() {
        return !!this._kc.token;
    }

    getAuthenticationState(): AuthenticationState {
        return this.appDataStore?.getState()[this.model.name];
    }

    onError(message: string) {
        if (!this.getAuthenticationState().hasError) {
            alert(message);

            this.appDataStore?.sendEvent(this.model.actions.setHasError(true))

            this.doLogout();
        }
    }

    updateToken(successCallback: any) {
        let prevToken = this.getToken();
        return this._kc.updateToken(5)
            .then(successCallback)
            .catch(() => {
                this.onError('Access Denied\n');
            })
            .finally(() => {
                if (this.getToken() !== prevToken) {
                    this.appDataStore?.sendEvent(this.model.actions.setProfile(this._kc.profile));
                }
            })
    }

    getUsername() {
        return this.getAuthenticationState().profile.username;
    }

    getUserProfile() {
        return this.getAuthenticationState().profile;
    }

    getUserId() {
        return this.getAuthenticationState().profile.id;
    }

    hasRole(roles: any) {
        return roles.some((role: any) => this._kc.hasRealmRole(role));
    }

    keyCloakEnabled(): boolean {
        return keycloakEnabled;
    }
}
