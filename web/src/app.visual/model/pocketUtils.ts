import {ExcerptMapper, NoteInfo, PocketMapper} from "../../app.model";
import {Nullable} from "../../framework.core/extras/typeUtils";
import {createSelector} from "@reduxjs/toolkit";
import {pocketService} from "../../serviceComposition";
import {forEach} from "../../framework.visual/extras/utils/collectionUtils";
import {ResourceMapper} from "../../app.model";

export function buildSinglePocketNode(pocketMapper: PocketMapper) : Nullable<PocketNodeVM> {
    return null;
}

export function buildAllPocketNode(pocketMappers: Record<string, PocketMapper>) : PocketNodeVM[] {
    return [];
}

export const getPocketNodeVMs = createSelector(
    [() => pocketService.getPocketMappers()],
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

export const getPocketTree = createSelector(
    [getPocketNodeVMs],
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

export enum PocketNodeType {
    POCKET='POCKET',
    REPORT='REPORT',
    DOCUMENT='DOCUMENT',
    EXCERPT='EXCERPT',
    NOTE='NOTE'
}

export type PocketNodeVM = {
    id: string,
    path: string,
    title: string,
    content: string,
    type: PocketNodeType
    // expanded: boolean,
    // selected: boolean,
    childNodes: PocketNodeVM[],
}