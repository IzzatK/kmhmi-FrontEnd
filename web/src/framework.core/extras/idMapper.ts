import {Nullable} from "./utils/typeUtils";

interface IKeyMapper {
    addLocalKey(className: string, localId: string): void;

    hasLocalKey(className: string, localId: string): boolean;
    addLocalToServerMapping(className: string, localId: string, serverId: string): void;

    getServerKey(className: string, localId: string): Nullable<string>;
    getLocalKey(className: string, serverId: string): Nullable<string>;
}

export class KeyMapper implements IKeyMapper {
    localToServerByClassLookup: Record<string, Record<string, string>> = {};
    serverToLocalByClassLookup: Record<string, Record<string, string>> = {};


    constructor() {

    }

    addLocalKey(className: string, localId: string): void {
    }

    addLocalToServerMapping(className: string, localId: string, serverId: string): void {
    }

    getLocalKey(className: string, serverId: string): Nullable<string> {
        return null;
    }

    getServerKey(className: string, localId: string): Nullable<string> {
        return null;
    }

    hasLocalKey(className: string, localId: string): boolean {
        return false;
    }
}