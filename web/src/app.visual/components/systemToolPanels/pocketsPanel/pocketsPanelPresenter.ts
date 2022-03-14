import PocketsPanelView from "./pocketsPanelView";
import {Presenter} from "../../../../framework.visual/extras/presenter";
import {createComponentWrapper} from "../../../../framework.visual/wrappers/componentWrapper";
import {createSelector, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {displayService, pocketService, selectionService} from "../../../../serviceComposition";
import {forEach} from "../../../../framework.visual/extras/utils/collectionUtils";
import {ExcerptMapper, NoteInfo, PocketMapper, ResourceMapper} from "../../../../app.model";
import {PocketNodeType} from "../../../model/pocketNodeType";
import {PocketNodeVM} from "./pocketsPanelModel";
import {DocumentPanelId} from "../../documentPanel/documentPanelPresenter";


type PocketSliceState = {
    expandedPaths: string[]
}

type PocketCaseReducers =  {
    addExpandedPath: (state: PocketSliceState, action: PayloadAction<string>) => void;
    removeExpandedPath: (state:PocketSliceState, action:PayloadAction<string>) => void;
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
                expandedPaths: []
            } as PocketSliceState,
            reducers: {
                addExpandedPath: (state: PocketSliceState, action: PayloadAction<string>) => {
                    const expandedPath = action.payload;
                    let matchedPath = '';

                    state.expandedPaths.forEach((existingPath:string) => {
                        if (expandedPath.includes(existingPath)) {
                            matchedPath = existingPath;
                        }
                    })

                    if (matchedPath) {
                        const index = state.expandedPaths.indexOf(matchedPath);
                        if (index !== -1) {
                            state.expandedPaths.splice(index, 1);
                        }
                    }

                    state.expandedPaths.push(expandedPath);
                },
                removeExpandedPath: (state:PocketSliceState, action:PayloadAction<string>) => {
                    const expandedPath = action.payload;
                    let matchedPath = '';

                    state.expandedPaths.forEach((existingPath:string) => {
                        // reverse includes from adding
                        if (existingPath.includes(expandedPath)) {
                            matchedPath = existingPath;
                        }
                    })

                    if (matchedPath) {
                        const index = state.expandedPaths.indexOf(matchedPath);
                        if (index !== -1) {
                            state.expandedPaths.splice(index, 1);
                        }
                    }

                    if (expandedPath.includes('/')) {
                        state.expandedPaths.push(expandedPath);
                    }
                }
            },
        });

        this.mapStateToProps = (state: any, props: any) => {
            return {
                data: this.getPocketTree(state),
            }
        }

        this.mapDispatchToProps = (dispatch: any) => {
            return {
                onPocketItemSelected: (id: string) => this.onPocketItemSelected(id),
                onPocketItemToggle: (id: string, expanded: boolean) => this.onPocketItemToggle(id, expanded),
                onCreatePocket: (title: string) => pocketService.createPocket(title),
            };
        }
    }

    getPocketNodeVMs = createSelector(
        [() => pocketService.getPocketMappers(), this.getExpandedPaths],
        (pocketMappers, expandedPaths) => {
            let nodeVMs: Record<string, PocketNodeVM> = {};

            forEach(pocketMappers, (pocketMapper: PocketMapper) => {
                const pocket = pocketMapper.pocket;

                // add the pocket
                const pocketPath = `/${pocket.id}`;
                nodeVMs[pocketPath] = {
                    id: pocket.id,
                    type: PocketNodeType.POCKET,
                    path: `/${pocket.id}`,
                    title: pocket.title || '',
                    content: '',
                    childNodes: []
                }

                forEach(pocketMapper.resourceMappers, (resourceMapper: ResourceMapper) => {
                    const resource = resourceMapper.resource;
                    const resourcePath = `${pocketPath}/${resource.id}`;

                    nodeVMs[resourcePath] = {
                        id: resource.id,
                        type: PocketNodeType.DOCUMENT,
                        path: resourcePath,
                        title: resource.title || '',
                        content: '',
                        childNodes: []
                    }

                    forEach(resourceMapper.excerptMappers, (excerptMapper: ExcerptMapper) => {
                        const excerpt = excerptMapper.excerpt;
                        const excerptPath = `${resourcePath}/${excerpt.id}`;

                        nodeVMs[excerptPath] = {
                            id: excerpt.id,
                            type: PocketNodeType.EXCERPT,
                            path: excerptPath,
                            title: excerpt.text || '',
                            content: '',
                            childNodes: []
                        }

                        forEach(excerptMapper.notes, (note: NoteInfo) => {
                            const notePath = `${excerptPath}/${note.id}`;

                            nodeVMs[notePath] = {
                                id: note.id,
                                type: PocketNodeType.EXCERPT,
                                path: notePath,
                                title: note.text,
                                content: '',
                                childNodes: []
                            }
                        })

                    })
                });
            });

            return nodeVMs;
        }
    );

    getSelectedPocketNodeId = selectionService.makeGetContext("selected-pocket-node");

    onPocketItemSelected(id: string) {
        debugger;
        selectionService.setContext("selected-pocket-node", id);
    }

    onPocketItemToggle(id: string, expanded: boolean) {
        debugger;
        // selectionService.setContext("selected-pocket-node", id);
    }

    getSelectedPocketPath = createSelector(
        [this.getPocketNodeVMs, this.getSelectedPocketNodeId],
        (nodeVMs, selectedId) => {
            let result = '';

            forEach(nodeVMs, (nodeVM: PocketNodeVM) => {
                if (nodeVM.id === selectedId) {
                    result = nodeVM.path;
                }
            })

            return result;
        }
    )

    getPocketTree = createSelector(
        [this.getPocketNodeVMs],
        (nodeVMs) => {

            // build the visual data structure, using the hash map
            let dataTreeVM: PocketNodeVM[] = [];

            if (nodeVMs) {
                forEach(nodeVMs, (nodeVM: PocketNodeVM) => {
                    let lastPathIndex = nodeVM.path.lastIndexOf('/');
                    let parentId = nodeVM.path.slice(0, lastPathIndex);

                    if( parentId && parentId.length > 0) {
                        nodeVMs[parentId].childNodes.push(nodeVMs[nodeVM.path])
                    }
                    else {
                        dataTreeVM.push(nodeVMs[nodeVM.path])
                    }
                })
            }

            return dataTreeVM;
        }
    )

    private getExpandedPaths (state: any) {
        return this.getPersistentState(state)?.expandedPaths;
    }
}

export const {
    connectedPresenter: PocketsPanelPresenter,
    componentId: PocketsPanelId
} = createComponentWrapper(_PocketsPanelPresenter);
