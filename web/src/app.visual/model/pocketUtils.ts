import {PocketMapper} from "../../app.model";
import {Nullable} from "../../framework.core/extras/typeUtils";

export function buildSinglePocketNode(pocketMapper: PocketMapper) : Nullable<PocketNodeVM> {
    return null;
}

export function buildAllPocketNodes(pocketMappers: Record<string, PocketMapper>) : PocketNodeVM[] {
    return [];
}

export type PocketNodeVM = {
    id: string,
    path: string,
    title: string,
    expanded: boolean,
    selected: boolean,
    children: PocketNodeVM[],
}