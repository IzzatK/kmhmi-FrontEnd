import PocketsPanelView from "./pocketsPanelView";
import {VisualWrapper} from "../../../framework.visual";
import {createVisualConnector} from "../../../framework.visual";
import {createSelector, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {pocketService, selectionService, userService} from "../../../serviceComposition";
import {forEach} from "../../../framework.core/extras/utils/collectionUtils";
import {ExcerptMapper, NoteInfo, PocketMapper, ResourceMapper} from "../../../app.model";
import {PocketNodeType} from "../../model/pocketNodeType";
import {PocketNodeVM, PocketsPanelDispatchProps, PocketsPanelStateProps, PocketUpdateParams} from "./pocketsPanelModel";
import {PocketParamType} from "../../../app.core.api";


type PocketSliceState = {
    expandedPaths: string[]
}

type PocketCaseReducers =  {
    addExpandedPath: (state: PocketSliceState, action: PayloadAction<string>) => void;
    removeExpandedPath: (state:PocketSliceState, action:PayloadAction<string>) => void;
};


class _PocketsPanelPresenter extends VisualWrapper<PocketSliceState, PocketCaseReducers> {

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

                    if (!state.expandedPaths.includes(expandedPath)) {
                        state.expandedPaths.forEach((existingPath:string) => {
                            if (expandedPath.startsWith(existingPath)) {
                                matchedPath = existingPath;
                                return true;
                            }
                            else if (existingPath.startsWith(expandedPath)) {
                                matchedPath = existingPath;
                                return true;
                            }
                        })

                        if (matchedPath) {
                            while (state.expandedPaths.indexOf(matchedPath) !== -1) {
                                const index = state.expandedPaths.indexOf(matchedPath);
                                if (index !== -1) {
                                    state.expandedPaths.splice(index, 1);
                                }
                            }

                        }

                        state.expandedPaths.push(expandedPath);
                    }
                },
                removeExpandedPath: (state:PocketSliceState, action:PayloadAction<string>) => {
                    const expandedPath = action.payload;
                    let matchedPath = '';

                    state.expandedPaths.forEach((existingPath:string) => {
                        // reverse includes from adding
                        if (existingPath.includes(expandedPath)) {
                            matchedPath = existingPath;
                            return true;
                        }
                    })

                    if (matchedPath) {
                        const index = state.expandedPaths.indexOf(matchedPath);
                        if (index !== -1) {
                            state.expandedPaths.splice(index, 1);
                        }
                    }

                    if (expandedPath.includes('/', 1)) {
                        let index = expandedPath.lastIndexOf('/');
                        const shortenedPath = expandedPath.substr(0, index);
                        state.expandedPaths.push(shortenedPath);
                    }
                }
            },
        });

        this.mapStateToProps = (state: any, props: any): PocketsPanelStateProps => {
            return {
                data: this.getPocketTree(state),
                selectionPath: this.getSelectedPocketNodePath(state),
                expandedPaths: this.getExpandedPaths(state),
                searchText: userService.getSearchText(),
            }
        }

        this.mapDispatchToProps = (dispatch: any): PocketsPanelDispatchProps => {
            return {
                onPocketItemSelected: (id: string) => this.onPocketItemSelected(id),
                onPocketItemToggle: (id: string, expanded: boolean) => this.onPocketItemToggle(id, expanded),
                onCreatePocket: (title: string) => pocketService.addOrUpdatePocket({title}),
                onDownloadDocument(id: string): void {
                },
                onDownloadPocket(id: string): void {
                },
                onUpdatePocket: (edits: PocketUpdateParams) => this._onUpdatePocket(edits),
                onRemoveExcerpt: (id: string, pocket_id: string) => this._onRemoveExcerpt(id, pocket_id),
                onRemoveResource: (id: string, pocket_id: string) => this._onRemoveResource(id, pocket_id),
                onRemoveNote: (id: string, pocket_id: string) => this._onRemoveNote(id, pocket_id),
                onSearch: () => userService.fetchUsers(),
                onSearchTextChanged: (value: string) => userService.setSearchText(value),
                onDelete: (id: string) => pocketService.removePocket(id),
            };
        }
    }

    private _onUpdatePocket(edits: PocketUpdateParams) {
        const params: PocketParamType = {
            id: edits.id
        }

        if (edits.title) {
            params.title = edits.title
        }

        void pocketService.addOrUpdatePocket(params)
    }

    getPocketNodeVMs = createSelector(
        [(s) => pocketService.getPocketMappers()],
        (pocketMappers) => {
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
                    childNodes: [],
                    pocket_id: pocket.id,
                }

                forEach(pocketMapper.resourceMappers, (resourceMapper: ResourceMapper) => {
                    const resource = resourceMapper.resource;
                    const resourcePath = `${pocketPath}/${resource.id}`;

                    nodeVMs[resourcePath] = {
                        id: resource.id,
                        type: PocketNodeType.DOCUMENT,
                        path: resourcePath,
                        title: resource.source_title || '',
                        content: '',
                        childNodes: [],
                        pocket_id: pocket.id,
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
                            childNodes: [],
                            pocket_id: pocket.id,
                        }

                        forEach(excerptMapper.notes, (note: NoteInfo) => {
                            const notePath = `${excerptPath}/${note.id}`;

                            nodeVMs[notePath] = {
                                id: note.id,
                                type: PocketNodeType.NOTE,
                                path: notePath,
                                title: note.text,
                                content: '',
                                childNodes: [],
                                pocket_id: pocket.id,
                            }
                        })

                    })
                });
            });

            return nodeVMs;
        }
    );

    getSelectedPocketNodePath = selectionService.makeGetContext("selected-pocket-node-path");

    onPocketItemSelected(id: string) {
        selectionService.setContext("selected-pocket-node-path", id);
    }

    onPocketItemToggle(id: string, expanded: boolean) {
        if (expanded) {
            this.sendEvent(this.model?.actions.addExpandedPath(id));
        }
        else {
            this.sendEvent(this.model?.actions.removeExpandedPath(id));
        }
    }

    getPocketTree = createSelector(
        [(s) => this.getPocketNodeVMs(s)],
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
        return this.getPersistentState(state)?.expandedPaths || [];
    }

    private _onRemoveExcerpt(id: string, pocket_id: string) {
        void pocketService.removeExcerptFromResource(id, pocket_id);
    }

    private _onRemoveNote(id: string, pocket_id: string) {
        void pocketService.removeNoteFromExcerpt(id, pocket_id);
    }

    private _onRemoveResource(id: string, pocket_id: string) {
        void pocketService.removeResourceFromPocket(id, pocket_id);
    }
}

export const {
    connectedPresenter: PocketsPanelPresenter,
    componentId: PocketsPanelId
} = createVisualConnector(_PocketsPanelPresenter);
