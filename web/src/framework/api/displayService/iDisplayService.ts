import {Nullable} from "../../extras/typeUtils";
import {IBasePlugin} from "../IBasePlugin";
import {IStorage} from "../iDataStore";

export interface IDisplayService extends IBasePlugin {
    getSelectedNodeId(containerId: string): Nullable<string>;

    getContainer(containerId: string): any;

    setVisibility(nodeId: string, visible: boolean): void;

    toggleNode(nodeId: string): void;

    hideNode(nodeId: string): void;

    showNode(nodeId: string): void;

    popNode(containerId: string): void;

    pushNode(nextNodeId: string): void;

    getNodeInfo(nodeId: string): any;

    addNodeInfo(nodeId: string, nodeOptions: any): void;

    setStorage(value: Nullable<IStorage>): void;
}
