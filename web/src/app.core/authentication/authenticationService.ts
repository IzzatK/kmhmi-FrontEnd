import Keycloak, {KeycloakError, KeycloakLoginOptions, KeycloakLogoutOptions, KeycloakProfile} from "keycloak-js";
import {keycloakConfig} from "../../app.config/config";
import {
    AuthenticationProfile,
    AuthenticationStatus,
    IAuthenticationService,
    IAuthorizationService,
    IUserProvider
} from "../../app.core.api";
import {Nullable} from "../../framework/extras/typeUtils";
import {IStorage} from "../../framework.api";
import {Plugin} from "../../framework/extras/plugin";
import {createSlice, PayloadAction, Slice} from "@reduxjs/toolkit";
import {UserInfo} from "../../app.model";


type AuthenticationState = {
    hasError: boolean;
    profile: AuthenticationProfile,
    registrationStatus: AuthenticationStatus,
    isAuthenticating: boolean,
}

type AuthenticationSliceType = Slice<AuthenticationState,
    {
        setHasError: (state: AuthenticationState, action: PayloadAction<boolean>) => void;
        setProfile: (state:AuthenticationState, action:PayloadAction<AuthenticationProfile>) => void;
        setRegistrationStatus: (state:AuthenticationState, action:PayloadAction<AuthenticationStatus>) => void;
        setIsAuthenticating: (state:AuthenticationState, action:PayloadAction<boolean>) => void;
    }>;

export class AuthenticationService extends Plugin implements IAuthenticationService {
    public static readonly class:string = 'AuthenticationService';
    private appDataStore: Nullable<IStorage> = null;

    private _kc!: Keycloak.KeycloakInstance;
    private readonly REDIRECT_URI: string;
    private readonly loginOptions: KeycloakLoginOptions;
    private readonly logoutOptions: KeycloakLogoutOptions;

    private authorizationService: Nullable<IAuthorizationService> = null;

    private model: AuthenticationSliceType;
    private userProvider: Nullable<IUserProvider> = null;

    constructor() {
        super();
        this.appendClassName(AuthenticationService.class);

        this.REDIRECT_URI = '';
        this.loginOptions = {
            prompt:"login"
        };
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
                isAuthenticating: false,
                registrationStatus: AuthenticationStatus.NONE,
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
                setRegistrationStatus: (state, action) => {
                    state.registrationStatus = action.payload;
                },
                setIsAuthenticating: (state, action) => {
                    state.isAuthenticating = action.payload;
                }
            },
        });
    }

    setAuthorizationService(authorizationService: IAuthorizationService): void {
        this.authorizationService = authorizationService;
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

    setUserProvider(userProvider: IUserProvider) {
        this.userProvider = userProvider;
    }

    private updateProfile(kcProfile: KeycloakProfile | undefined) {
        if (kcProfile != null) {
            let authenticationProfile: AuthenticationProfile = {
                email: kcProfile.email || '',
                firstName: kcProfile.firstName || "",
                id: kcProfile.id || '',
                lastName: kcProfile.lastName || "",
                username: kcProfile.username || ""
            }

            this.appDataStore?.sendEvent(this.model.actions.setProfile(authenticationProfile));
        }
        else {
            let authenticationProfile: AuthenticationProfile = {
                email: '',
                firstName: '',
                id: '',
                lastName: '',
                username: '',
            }

            this.appDataStore?.sendEvent(this.model.actions.setProfile(authenticationProfile));
        }

    }

    login() {
        this.setIsAuthenticating(true);

        const s = document.createElement("script");
        s.type = "text/javascript";
        s.src = "https://auth.navyanalytics.com/auth/js/keycloak.js";
        document.head.append(s)

        s.onload = this.keyCloakLoadedHandler;
    }

    private keyCloakLoadedHandler(ev: any) {
        this._kc = Keycloak(keycloakConfig);
        const me = this;
        this._kc.init({
            onLoad: "login-required",
        })
            .then((authenticated: any) => {
                if (authenticated) {
                    //Authentication was successful, retrieve the user info
                    this._kc.loadUserProfile()
                        .then(() => {
                            let kcProfile = this._kc.profile;
                            const userId = kcProfile?.id || '';
                            me.updateProfile(kcProfile);
                            me.setIsAuthenticating(false);

                            if (userId == null) {
                                me.error(`Invalid user id for profile: ${JSON.stringify(kcProfile)}`);
                            }
                            else {
                                me.authorizationService?.authorizeUser(userId);
                            }
                        })
                        .catch((ex) => {
                            me.onError('No longer authenticated: Invalid Certificate\n')
                        })
                } else {
                    this.onError('Not authenticated');
                }

            })
            .catch((ex: KeycloakError) => {
                this.onError('Failed to authenticate with keycloak: \n' + JSON.stringify(ex));
            })
    }

    logout() {
        this._kc.logout(this.logoutOptions).then(this._kc.clearToken);
    }

    getToken() {
        return this._kc?.token || '';
    }

    isLoggedIn() {
        return !!this._kc?.token;
    }

    getAuthenticationStatus(): AuthenticationStatus {
        return this.getState().registrationStatus;
    }

    setRegistrationStatus(status: AuthenticationStatus) {
        this.appDataStore?.sendEvent(this.model.actions.setRegistrationStatus(status))
    }

    getState(): AuthenticationState {
        return this.appDataStore?.getState()[this.model.name];
    }

    private onError(message: string) {
        this.setIsAuthenticating(false);
        if (!this.getState().hasError) {
            alert(message);

            this.appDataStore?.sendEvent(this.model.actions.setHasError(true))

            this.logout();
        }
    }

    securedFetch(successCallback: () => void) {
        let prevToken = this.getToken();
        return this._kc?.updateToken(5)
            .then(successCallback)
            .catch((reason: any) => {
                // this.onError('Access Denied\n');
            })
            .finally(() => {
                if (this.getToken() !== prevToken) {
                    this.updateProfile(this._kc.profile);
                }
            })
    }

    register(userInfo: UserInfo) {
        this.setRegistrationStatus(AuthenticationStatus.CREATED);

        this.setIsAuthenticating(true);
        this.userProvider?.create({user: userInfo},
            (updatedUserInfo => {
                this.addOrUpdateRepoItem(updatedUserInfo);

                // need to set a temporary id
            }))
            .then(latestUser => {
                if (latestUser != null) {
                    this.login();
                }
            })
            .catch(error => {
                console.log(error);
            });
    }

    getUsername() {
        return this.getState().profile.username;
    }

    getUserProfile() {
        return this.getState().profile;
    }

    getUserId() {
        return this.getState().profile.id;
    }

    setIsAuthenticating(value: boolean): void {
        this.appDataStore?.sendEvent(this.model.actions.setIsAuthenticating(value))
    }

    isAuthenticating(): boolean {
        return this.getState().isAuthenticating;
    }
}
