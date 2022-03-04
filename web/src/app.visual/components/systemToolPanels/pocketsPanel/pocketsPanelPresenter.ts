import PocketsPanelView from "./pocketsPanelView";
import {Presenter} from "../../../../framework.visual/extras/presenter";
import {createComponentWrapper} from "../../../../framework.visual/wrappers/componentWrapper";
import {createSelector, createSlice, PayloadAction} from "@reduxjs/toolkit";


type PocketSliceState = {
    selectionPaths: string[]
}

type PocketCaseReducers =  {
    addSelectionPath: (state: PocketSliceState, action: PayloadAction<string>) => void;
    removeSelectionPath: (state:PocketSliceState, action:PayloadAction<string>) => void;
};


class _PocketsPanelPresenter extends Presenter<PocketSliceState, PocketCaseReducers> {

    constructor() {
        super();

        this.id ='app.visual/components/pocketsPanel';

        this.view = PocketsPanelView;

        this.displayOptions = {
            containerId: 'system-tool-panel',
            visible: false,
            appearClass: 'fadeIn',
            enterClass: 'fadeIn',
        };

        this.model = createSlice({
            name: this.id,
            initialState: {
                selectionPaths: []
            } as PocketSliceState,
            reducers: {
                addSelectionPath: (state: PocketSliceState, action: PayloadAction<string>) => {
                    const selectionPath = action.payload;
                    let matchedPath = '';

                    state.selectionPaths.forEach((existingPath:string) => {
                        if (selectionPath.includes(existingPath)) {
                            matchedPath = existingPath;
                        }
                    })

                    if (matchedPath) {
                        const index = state.selectionPaths.indexOf(matchedPath);
                        if (index !== -1) {
                            state.selectionPaths.splice(index, 1);
                        }
                    }

                    state.selectionPaths.push(selectionPath);
                },
                removeSelectionPath: (state:PocketSliceState, action:PayloadAction<string>) => {
                    const selectionPath = action.payload;
                    let matchedPath = '';

                    state.selectionPaths.forEach((existingPath:string) => {
                        // reverse includes from adding
                        if (existingPath.includes(selectionPath)) {
                            matchedPath = existingPath;
                        }
                    })

                    if (matchedPath) {
                        const index = state.selectionPaths.indexOf(matchedPath);
                        if (index !== -1) {
                            state.selectionPaths.splice(index, 1);
                        }
                    }

                    if (selectionPath.includes('/')) {
                        state.selectionPaths.push(selectionPath);
                    }
                }
            },
        });

        this.mapStateToProps = (state: any, props: any) => {
            return {
                data: this.getTreeData(state),
                selectionPaths: this.getSelectionPaths(state)
            }
        }

        this.mapDispatchToProps = (dispatch: any) => {
            return {
                addSelectionPath: (selectionPath: string) => dispatch(this.model?.actions.addSelectionPath(selectionPath)),
                removeSelectionPath: (selectionPath: string) => dispatch(this.model?.actions.removeSelectionPath(selectionPath))
            };
        }
    }

    private getSelectionPaths (state: any) {
        return this.getPersistentState(state)?.selectionPaths;
    }

    getTreeData = createSelector(
        [this.getSelectionPaths, () => mockData],
        (selectionPaths, mockData) => {
            return mockData;
        }
    )
}

const mockData = [
    {
        id: "pocket_01",
        type: "pocket",
        name: "Air Space Pocket",
        properties: {
            location: "extra prop",
        },
        path: "pocket_01",
        childNodes: [
            {
                id: "report_01",
                type: "report",
                name: "Report: Air Space",
                properties: {
                    location: "extra prop",
                },
                path: "pocket_01/report_01",
                childNodes: [
                    {
                        id: "document_01",
                        type: "document",
                        name: "Solar Flares.doc",
                        properties: {
                            location: "extra prop",
                        },
                        path: "pocket_01/report_01/document_01",
                    },
                    {
                        id: "document_02",
                        type: "document",
                        name: "Starlight.doc",
                        properties: {
                            location: "extra prop",
                        },
                        path: "pocket_01/report_01/document_02",
                    },
                    {
                        id: "document_03",
                        type: "document",
                        name: "Neptune.doc",
                        properties: {
                            location: "extra prop",
                        },
                        path: "pocket_01/report_01/document_02",
                    }
                ]
            },
        ]
    },
    {
        id: "pocket_02",
        type: "pocket",
        name: "High School Pocket",
        properties: {
            location: "extra prop",
        },
        path: "pocket_02",
    },
    {
        id: "pocket_03",
        type: "pocket",
        name: "Nose Injuries Pocket",
        properties: {
            location: "extra prop",
        },
        path: "pocket_03",
    }
];

export const {
    connectedPresenter: PocketsPanelPresenter,
    componentId: PocketsPanelId
} = createComponentWrapper(_PocketsPanelPresenter);
