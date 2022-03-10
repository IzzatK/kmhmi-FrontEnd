import {ExcerptInfo, ExcerptMapper, NoteInfo, PocketMapper, ReportDocumentInfo} from "../../app.model";
import {Nullable} from "../../framework.core/extras/typeUtils";
import {createSelector} from "@reduxjs/toolkit";
import {pocketService} from "../../app.core/serviceComposition";
import {forEach} from "../../framework.visual/extras/utils/collectionUtils";
import {ReportMapper} from "../../app.model/pockets/reportMapper";
import {ReportDocumentMapper} from "../../app.model/pockets/reportDocumentMapper";

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
                title: pocket.title,
                childNodes: []
            }

            forEach(pocketMapper.reportMappers, (reportMapper: ReportMapper) => {
                const report = reportMapper.report;
                const reportPath = `${pocketPath}/${report.id}`;

                nodeVMs[reportPath] = {
                    id: reportMapper.id,
                    type: PocketNodeType.REPORT,
                    path: reportPath,
                    title: reportMapper.report.title,
                    childNodes: []
                }

                forEach(reportMapper.reportDocumentMappers, (reportDocumentMapper: ReportDocumentMapper) => {
                    const reportDocument = reportDocumentMapper.document;
                    const reportDocumentPath = `${reportPath}/${reportDocument.id}`;

                    nodeVMs[reportDocumentPath] = {
                        id: reportDocument.id,
                        type: PocketNodeType.DOCUMENT,
                        path: reportDocumentPath,
                        title: reportDocument.title,
                        childNodes: []
                    }

                    forEach(reportDocumentMapper.excerptMappers, (excerptMapper: ExcerptMapper) => {
                        const excerpt = excerptMapper.excerpt;
                        const excerptPath = `${reportDocumentPath}/${excerpt.id}`;

                        nodeVMs[excerptPath] = {
                            id: excerpt.id,
                            type: PocketNodeType.EXCERPT,
                            path: excerptPath,
                            title: '',
                            childNodes: []
                        }

                        forEach(excerptMapper.notes, (note: NoteInfo) => {
                            const notePath = `${excerptPath}/${note.id}`;

                            nodeVMs[excerptPath] = {
                                id: note.id,
                                type: PocketNodeType.EXCERPT,
                                path: notePath,
                                title: '',
                                childNodes: []
                            }
                        })

                    })

                })
            });
        })


        // // build the hash map used to store data
        // let nodeKeys = Object.keys(nodes), nodesLength = nodeKeys.length;
        // for (let index = 0; index < nodesLength; index++) {
        //     let node = nodes[nodeKeys[index]];
        //
        //     let nodeVM = {
        //         id: node.path,
        //         path: node.path,
        //         type: node.type,
        //         name: node.name,
        //         properties: {
        //             ...node.properties
        //         },
        //         notificationCount: 0,
        //         childNodes : [],
        //     };
        //
        //     nodeVMs[node.path] = nodeVM;
        // }
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
    type: PocketNodeType
    // expanded: boolean,
    // selected: boolean,
    childNodes: PocketNodeVM[],
}