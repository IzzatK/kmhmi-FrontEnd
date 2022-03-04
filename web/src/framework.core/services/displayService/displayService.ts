import {BasePlugin} from "../../extras/basePlugin";
import {createSlice, PayloadAction, Slice} from "@reduxjs/toolkit";
import {Nullable} from "../../extras/typeUtils";
import {IDisplayService, IStorage} from "../../../framework.api";

export type NodeInfo = {
    containerId?: string,
    visible?: boolean,
    appearClass?: string,
    enterClass?: string,
    exitClass?: string,
    timeout?: number
}

type ContainerInfo = {
    currentNodeId: Nullable<string>
}

interface DisplayState {
    nodes: Record<string, NodeInfo> // redux by class, then by id
    containers: Record<string, ContainerInfo>
}

type DisplaySliceType = Slice<DisplayState,
    {
        containerUpdatedHandler: (state: DisplayState, action: PayloadAction<{ nodeId: string; containerId: string }>) => void;
        nodeInfoUpdatedHandler: (state: DisplayState, action: PayloadAction<{ nodeId: string; options: any }>) => void;
        visibilityUpdatedHandler: (state: DisplayState, action: PayloadAction<{ nodeId: string; visible: boolean }>) => void
    }, string>;

export class DisplayService extends BasePlugin implements IDisplayService {
    public static readonly class:string = 'DisplayService';
    private appDataStore: Nullable<IStorage> = null;

    private model: DisplaySliceType;


    constructor() {
        super();
        this.appendClassName(DisplayService.class);

        this.model = createSlice({
            name: 'framework.core/display',
            initialState: {
                nodes: {},
                containers: {}
            },
            reducers: {
                nodeInfoUpdatedHandler: (state, action: PayloadAction<{nodeId: string, options: any}>) => {
                    const { nodeId, options}  = action.payload;

                    const { visible, containerId} = options;

                    state.nodes[nodeId] = options;

                    if (containerId) {
                        if (state.containers[containerId] === undefined) {
                            state.containers[containerId] = {
                                currentNodeId: null
                            };
                        }
                        if (visible) {
                            state.containers[containerId].currentNodeId = nodeId;
                        }
                    }
                },
                containerUpdatedHandler: (state, action: PayloadAction<{nodeId: string, containerId: string}>) => {
                    const { nodeId, containerId } = action.payload;

                    state.containers[containerId].currentNodeId = nodeId;
                },
                visibilityUpdatedHandler: (state, action: PayloadAction<{nodeId: string, visible: boolean}>) => {
                    const { nodeId, visible } = action.payload;

                    let node = state.nodes[nodeId];
                    if (node) {
                        node.visible = visible;
                    }
                }
            },
        });
    }


    setStorage(value: Nullable<IStorage>) {
        this.appDataStore = value;
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

    getSelectedNodeId(containerId: string): Nullable<string> {
        let result = null;

        let container = this.getContainer(containerId);
        if (container != null) {
            result = container.currentNodeId;
        }
        return result;
    }

    getContainer (containerId: string): ContainerInfo {
        return this.appDataStore?.getState()[this.model.name].containers[containerId];
    }

    setVisibility(nodeId: string, visible: boolean) {
        this.appDataStore?.sendEvent(this.model.actions.visibilityUpdatedHandler({ nodeId, visible }));
    }

    toggleNode(nodeId: string) {
        let viewInfo = this.getNodeInfo(nodeId);

        if (viewInfo && viewInfo.visible === true) {
            this.setVisibility(nodeId, false);
        } else {
            this.setVisibility(nodeId, true);
        }
    }

    hideNode(nodeId: string) {
        let viewInfo = this.getNodeInfo(nodeId);

        if (viewInfo && viewInfo.visible === true) {
            this.setVisibility(nodeId, false);
        }
    }

    showNode(nodeId: string) {

        let viewInfo = this.getNodeInfo(nodeId);

        if (viewInfo && viewInfo.visible === false) {
            this.setVisibility(nodeId, true);
        }
    }

    popNode(containerId: string) {
        let container = this.getContainer(containerId);

        let currentNodeId = container.currentNodeId;

        if (currentNodeId != null) {
            this.setVisibility(currentNodeId, false);
        }

        this.appDataStore?.sendEvent(this.model.actions.containerUpdatedHandler({ containerId, nodeId: '' }));
    }

    pushNode(nextNodeId: string) {

        let viewInfo = this.getNodeInfo(nextNodeId);

        let containerId = viewInfo.containerId;

        let container = this.getContainer(containerId);

        let currentNodeId = container.currentNodeId;

        if (nextNodeId === currentNodeId) return;

        if (currentNodeId != null) {
            this.setVisibility(currentNodeId, false);
        }

        this.setVisibility(nextNodeId, true)

        if (nextNodeId !== undefined) {
            this.appDataStore?.sendEvent(this.model.actions.containerUpdatedHandler({ containerId, nodeId: nextNodeId }));
        }
    }

    getNodeInfo(nodeId: string) {
        return this.appDataStore?.getState()[this.model.name].nodes[nodeId];
    }

    addNodeInfo(nodeId: string, nodeOptions: NodeInfo) {
        // set up some default options
        let defaultOptions = {
            containerId: '',
            visible: true,
            appearClass: '',
            enterClass: '',
            exitClass: '',
            timeout: 300
        }

        let mergedOptions = Object.assign({}, defaultOptions, nodeOptions);

        this.appDataStore?.sendEvent(this.model.actions.nodeInfoUpdatedHandler({ nodeId, options: mergedOptions }));
    }
}
