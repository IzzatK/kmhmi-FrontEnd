import {createSelector, createSlice, PayloadAction, Slice} from "@reduxjs/toolkit";
import {BasePlugin} from "../../extras/basePlugin";
import {ISelectionService, IStorage} from "../../../framework.api";
import {Nullable} from "../../extras/typeUtils";

interface ContextHandlerAction {
    key: string;
    value: string;
}

interface SelectionState {
    contextMap: Record<string, string>
}

type SelectionSliceType = Slice<SelectionState,
    {
        setContextHandler: (state: SelectionState, action: PayloadAction<ContextHandlerAction>) => void
    }>;

export class SelectionService extends BasePlugin implements ISelectionService {
    public static readonly class:string = 'SelectionService';
    private storage: Nullable<IStorage> = null;
    private model: SelectionSliceType;

    constructor() {
        super();
        this.appendClassName(SelectionService.class);

        this.model = createSlice({
            name: 'application/selection',
            initialState: {
                contextMap: {}
            },
            reducers: {
                setContextHandler: (state, action: PayloadAction<ContextHandlerAction>) => {
                    // "mutate" the array by calling push()
                    let key = action.payload.key;
                    let value = action.payload.value;

                    state.contextMap[key] = value;
                },
            },
        });
    }

    start() {
        super.start();

        if (this.storage != null) {
            this.storage.addEventHandlers(this.model.name, this.model.reducer);
        }
        else {
            this.error("Data App Store not set for selection service");
        }
    }

    stop() {
        super.stop();
    }

    configure() {
        super.configure();
    }

    setAppDataStore(appDataStore: IStorage) {
        this.storage = appDataStore;
    }

    getContextMap = () => {
        return this.getModelState().contextMap;
    };

    getModelState(): SelectionState {
        return this.storage?.getState()[this.model.name];
    }

    getContext(key: string): string {
        return this.getModelState().contextMap[key];
    }

    setContext(key: string, value: string) {
        this.info(`Setting Selection: ${key} : ${value}`)
        this.storage?.sendEvent(this.model.actions.setContextHandler({key, value}));
    }

    makeGetContext(key: string) {
        return createSelector(
            [this.getContextMap],
            (contextMap) => {
                let result = contextMap[key];

                return result ? result : null;
            }
        );
    }
}
