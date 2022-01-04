import {createSlice, Dispatch, PayloadAction, Slice} from "@reduxjs/toolkit";
import {forEach, forEachKVP} from "../../../framework.visual/extras/utils/collectionUtils";
import {IRepoItem} from "./repoItem";
import {BasePlugin} from "../../extras/basePlugin";
import {Nullable} from "../../extras/typeUtils";
import {IStorage} from "../../api";
import {IRepositoryService} from "../../api";

interface RepoState {
    storage: Record<string, Record<string, IRepoItem>> // redux by class, then by id
    classToFullClassNameMap: Record<string, string>,
    storageByClass: Record<string, Record<string, IRepoItem>> // redux by class, then by id
}

interface RepoAction {
    items: IRepoItem[]
}

type RepoSliceType = Slice<RepoState,
    {
        addOrUpdateHandler: (state: RepoState, action: PayloadAction<RepoAction>) => void;
        removeByIdHandler: (state: RepoState, action: PayloadAction<{ className: string; ids: string[] }>) => void;
        removeByTypeHandler: (state: RepoState, action: PayloadAction<{ className: string; includeSubTypes: boolean }>) => void;
        removeHandler: (state: RepoState, action: PayloadAction<RepoAction>) => void;
    }>;

export class RepositoryService extends BasePlugin implements IRepositoryService {
    public static readonly class:string = 'RepositoryService';
    private storage: Nullable<IStorage> = null;

    private readonly initialState: RepoState;
    private model: RepoSliceType;

    constructor() {
        super();
        this.appendClassName(RepositoryService.class);

        this.initialState = {
            storage: {},
            classToFullClassNameMap: {},
            storageByClass: {}
        }

        this.model = createSlice({
            name: 'application/repository',
            initialState: this.initialState,
            reducers: {
                addOrUpdateHandler: (state, action: PayloadAction<RepoAction>) => {
                    forEach(action.payload.items, (item: IRepoItem) => {
                        let id = item.id;
                        let className = item.className;

                        let classes = className ? className.split('/') : [];
                        let shortName = classes[1];

                        if (!state.classToFullClassNameMap[shortName]) {
                            state.classToFullClassNameMap[shortName] = className;
                        }

                        if (!state.storageByClass[className]) {
                            state.storageByClass[className] = {};
                        }

                        state.storageByClass[className][id] = item;
                    })
                },
                removeHandler: (state, action: PayloadAction<RepoAction>) => {
                    forEach(action.payload.items, (item: IRepoItem) => {
                        let id = item.id;
                        let className = item.className;

                        this.removeSingle(state, className, id);
                    })
                },
                removeByTypeHandler: (state, action: PayloadAction<{className: string, includeSubTypes: boolean}>) => {
                    let className = action.payload.className;
                    let includeSubTypes = action.payload.includeSubTypes;


                    if (state.classToFullClassNameMap[className]) {
                        let fullClassName = state.classToFullClassNameMap[className];

                        if (state.storageByClass[fullClassName]) {
                            delete state.storageByClass[fullClassName];
                            delete state.classToFullClassNameMap[className];
                        }
                    }


                    if (includeSubTypes) {
                        forEachKVP(Object.values(state.classToFullClassNameMap), (shortClassName: string, longClassName: string) => {
                            if (longClassName.includes(`/${className}/`)) {
                                if (state.storageByClass[longClassName]) {
                                    delete state.storageByClass[longClassName];
                                    delete state.classToFullClassNameMap[shortClassName];
                                }
                            }
                        });
                    }
                },
                removeByIdHandler: (state, action: PayloadAction<{className: string, ids: string[]}>) => {
                    forEach(action.payload.ids, (itemId: string) => {
                        let id = itemId;
                        let className = action.payload.className;

                        let longClassName = state.classToFullClassNameMap[className];

                        if (longClassName) {
                            this.removeSingle(state, longClassName, id);
                        }
                    })
                },
            },
        });
    }

    getState() {
        return this.getRepoState();
    }

    start() {
        super.start();

        if (this.storage != null) {
            this.storage.addEventHandlers(this.model.name, this.model.reducer);
        }
        else {
            this.error("Data App Store not set for repository service");
        }
    }

    stop() {
        super.stop();
    }

    configure() {
        super.configure();
    }

    setStorage(value: Nullable<IStorage>) {
        this.storage = value;
    }

    removeSingle(state: RepoState, className:string, id: string) {
        if (state.storageByClass[className]) {
            if (state.storageByClass[className][id]) {
                delete state.storageByClass[className][id];
            }

            if (Object.keys(state.storageByClass[className]).length === 0) {
                delete state.storageByClass[className];

                let classes = className.split('/');
                if (classes[1]) {
                    delete state.classToFullClassNameMap[classes[1]];
                }
            }
        }
    }

    getRepoItem<Type extends IRepoItem>(className: string, id: string): Nullable<Type> {
        let result: Nullable<Type> = null;

        let repoState: RepoState = this.getRepoState();

        let fullClassName = '';
        if (repoState.classToFullClassNameMap[className]) {
            fullClassName = repoState.classToFullClassNameMap[className];
        }

        if (repoState.storageByClass[fullClassName]) {
            if (repoState.storageByClass[fullClassName][id] != null) {
                result = <Type>repoState.storageByClass[fullClassName][id];
            }
        }

        return result;
    };

    getAll<Type extends IRepoItem>(className: string, includeSubTypes: boolean = false, ...ids: string[]): Record<string, Type> {
        let result: Record<string, Type>;

        let repoState: RepoState = this.getRepoState();

        let fullClassName = '';
        if (repoState.classToFullClassNameMap[className]) {
            fullClassName = repoState.classToFullClassNameMap[className];
        }

        if (includeSubTypes) {
            result = {};
            forEachKVP(Object.values(repoState.classToFullClassNameMap), (shortClassName: string, longClassName: string) => {

                if (longClassName.includes(`/${className}/`)) {
                    forEachKVP(repoState.storageByClass[longClassName], (itemKey: string, itemValue: Type) => {
                        if (ids && ids.includes(itemKey)) {
                            result[itemKey] = itemValue;
                        } else {
                            result[itemKey] = itemValue;
                        }
                    })
                }
            });
        } else if (repoState.storageByClass[fullClassName]) {
            result = <Record<string, Type>>repoState.storageByClass[fullClassName];
            // forEachKVP(repoState.storageByClass[fullClassName], (itemKey: string, itemValue: Type) => {
            //     if (ids && ids.includes(itemKey)) {
            //         result[itemKey] = itemValue;
            //     }
            //     else {
            //         result[itemKey] = itemValue;
            //     }
            // })
        } else {
            result = {};
        }

        return result;
    };

    getRepoState(): RepoState {
        return this.storage?.getState()[this.model.name];
    }

    getClassDictionary(): Record<string, string>{
        return this.getRepoState().classToFullClassNameMap;
    }

    removeAllByType(className: string, includeSubTypes: boolean = false) {
        this.storage?.sendEvent(this.model.actions.removeByTypeHandler({className, includeSubTypes}))
    }

    addOrUpdateRepoItem<Type extends IRepoItem>(item: Type) {
        this.storage?.sendEvent(this.model.actions.addOrUpdateHandler({items: [item]}));
    }

    addOrUpdateAllRepoItems<Type extends IRepoItem>(items: Type[]) {
        this.storage?.sendEvent(this.model.actions.addOrUpdateHandler({items: items}));
    }

    removeRepoItem<Type extends IRepoItem>(item: Type) {
        this.storage?.sendEvent(this.model.actions.removeHandler({items: [item]}));
    }

    removeAllById(className: string, ...ids: string[]) {
        this.storage?.sendEvent(this.model.actions.removeByIdHandler({className, ids}));
    }
}
