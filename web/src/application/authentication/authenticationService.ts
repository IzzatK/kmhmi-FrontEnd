import Keycloak, {KeycloakError, KeycloakLoginOptions, KeycloakLogoutOptions, KeycloakProfile} from "keycloak-js";
import {keycloakConfig, keycloakEnabled} from "../../config/config";
import {AuthenticationProfile, IAuthenticationService, IUserProvider, IUserService} from "../../api";
import {Nullable} from "../../framework/extras/typeUtils";
import {IStorage} from "../../framework/api";
import {Plugin} from "../../framework/extras/plugin";
import {createSlice, PayloadAction, Slice} from "@reduxjs/toolkit";
import {makeGuid} from "../../framework.visual/extras/utils/uniqueIdUtils";
import {UserInfo} from "../../model";
import {forEachKVP} from "../../framework.visual/extras/utils/collectionUtils";


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

    private _kc!: Keycloak.KeycloakInstance;
    private readonly REDIRECT_URI: string;
    private readonly loginOptions: KeycloakLoginOptions;
    private readonly logoutOptions: KeycloakLogoutOptions;
    private userProvider!: IUserProvider;

    private model: AuthenticationSliceType;

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
        const s = document.createElement("script");
        s.type = "text/javascript";
        s.src = "https://auth.navyanalytics.com/auth/js/keycloak.js";
        document.head.append(s)

        s.onload = this.keyCloakLoadedHandler;
    }

    private keyCloakLoadedHandler(ev: any) {
        this._kc = Keycloak(keycloakConfig);
        this._kc.init({
            // checkLoginIframe: true,
            // checkLoginIframeInterval: 1000,
            // silentCheckSsoRedirectUri: window.location.origin,
            onLoad: "login-required",
            // messageReceiveTimeout: 60000
        })
            .then((authenticated: any) => {
                if (authenticated) {
                    //Authentication was successful, retrieve the user info
                    this._kc.loadUserProfile()
                        .then(() => {

                            let kcProfile = this._kc.profile;
                            const userId = kcProfile?.id;
                            // debugger
                            this.updateProfile(kcProfile);

                            // if (this.userService && userId != null) {
                            //     this.userService.setCurrentUser(userId);
                            // }

                            // // check if user exists
                            // if (userId != null) {
                            //     this.userProvider?.getSingle(userId)
                            //         .then(user => {
                            //             debugger
                            //             if (user != null) {
                            //
                            //             }
                            //             else {
                            //                 this.userService?.createUser({
                            //
                            //                 })
                            //             }
                            //         })
                            //         .catch(ex => {
                            //             debugger; // create the user
                            //         })
                            // }
                        })
                        .catch((ex) => {
                            debugger
                            this.onError('No longer authenticated: Invalid Certificate\n')
                        })
                } else {
                    this.onError('Not authenticated');
                }

            })
            .catch((ex: KeycloakError) => {
                debugger
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

    getAuthenticationState(): AuthenticationState {
        return this.appDataStore?.getState()[this.model.name];
    }

    onError(message: string) {
        if (!this.getAuthenticationState().hasError) {
            alert(message);

            this.appDataStore?.sendEvent(this.model.actions.setHasError(true))

            this.logout();
        }
    }

    updateToken(successCallback: any) {
        let prevToken = this.getToken();
        return this._kc?.updateToken(5)
            .then(successCallback)
            .catch((reason: any) => {
                // debugger;
                // this.onError('Access Denied\n');
            })
            .finally(() => {
                if (this.getToken() !== prevToken) {
                    this.updateProfile(this._kc.profile);
                }
            })
    }

    register(userInfo: UserInfo) {
        debugger
        this.userProvider?.create({user: userInfo},
            (updatedUserInfo => {
                // we have the real id now, so remove the temp one and add the real one
                this.addOrUpdateRepoItem(updatedUserInfo);
            }))
            .then(latestUser => {
                if (latestUser != null) {
                    this.addOrUpdateRepoItem(latestUser);
                }
            })
            .catch(error => {
                console.log(error);
            });
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
}
