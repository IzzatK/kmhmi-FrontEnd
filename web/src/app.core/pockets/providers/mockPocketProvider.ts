import {EntityProvider} from "../../common/providers/entityProvider";
import {PocketInfo, PocketMapper, ReportInfo} from "../../../app.model";
import {Nullable} from "../../../framework.core/extras/typeUtils";
import {forEach} from "../../../framework.visual/extras/utils/collectionUtils";
import {makeGuid} from "../../../framework.visual/extras/utils/uniqueIdUtils";
import {ReportMapper} from "../../../app.model/pockets/mappers/reportMapper";

export const serverUrl = process.env.REACT_APP_SERVER_URL;

export class MockPocketProvider extends EntityProvider<PocketMapper> {
    baseUrl: string = `${serverUrl}/pockets`;
    public static class: string = 'MockPocketProvider';

    constructor() {
        super();
        super.appendClassName(MockPocketProvider.class);
    }

    start() {
        super.start();

        generatePocketMapper('Saturn');
        generatePocketMapper('Earth');
        generatePocketMapper('Neptune');
    }

    getAll(uiRequestData?: any): Promise<PocketMapper[]> {
        return new Promise((resolve, reject) => {
            resolve(Object.values(pocketMappers));
        });
    }

    getSingle(id: string): Promise<Nullable<PocketMapper>> {
        return new Promise((resolve, reject) => {
            resolve(pocketMappers[id] || null);
        });
    }

    remove(id: string): Promise<Nullable<PocketMapper>> {
        return new Promise((resolve, reject) => {
            let result: Nullable<PocketMapper> = null;

            forEach(pocketMappers, (pocketMapper: PocketMapper) => {
                if (pocketMapper.id == id) {
                    result = pocketMapper;
                    return true;
                }
            })

            resolve(result);
        });
    }

    create(uiRequestData: string, onUpdated?: (item: PocketMapper) => void): Promise<Nullable<PocketMapper>> {
        return new Promise((resolve, reject) => {
            let pocketMapper = generatePocketMapper(uiRequestData);

            resolve(pocketMapper);
        });
    }

    update(id: string, uiRequestData: any): Promise<Nullable<PocketMapper>> {
        return new Promise((resolve, reject) => {
            let pocketMapper = pocketMappers[id];

            if (pocketMapper != null) {
                return super.update(id, uiRequestData);
            }
        });
    }
}

const pocketMappers: Record<string, PocketMapper> = {};

const generatePocketMapper = (title: string): PocketMapper => {

    const pocketId = makeGuid();
    const reportId = makeGuid();

    const report: ReportInfo = new ReportInfo(reportId);
    report.title = `Report ${title} - ${reportId}`;

    const pocket: PocketInfo = new PocketInfo(pocketId);
    pocket.title = `Pocket ${title} - ${pocketId}`;
    pocket.report_ids.push(report.id);

    const pocketMapper = new PocketMapper(
        pocket,
        {
            [report.id]: new ReportMapper(
                report,
                {}
            )
        }
    )

    pocketMappers[pocketId] = pocketMapper;

    return pocketMapper;
}

// let mockHMIData = [
//     {
//         id: "pocket_01",
//         pocket: {
//             className: "PocketInfo",
//             id: "pocket_01",
//             // title: "Air Space Pocket",
//             // reportId: "report_01"
//             // path: "pocket_01",
//         },
//         // report: {
//         //     className: "ReportInfo",
//         //     id: "report_01",
//         //     title: "Report: Air Space",
//         //     pocket_id: "pocket_01",
//         //     // path: "pocket_01/report_01",
//         // },
//         // notes: {},
//         // excerpts: {},
//         // documents: {
//         //     "document_01": {
//         //         className: "ReportDocumentInfo",
//         //         id: "document_01",
//         //         title: "Solar Flares.doc",
//         //         report_id: "report_01",
//         //         // path: "pocket_01/report_01/document_01",
//         //     },
//         //     "document_02": {
//         //         className: "ReportDocumentInfo",
//         //         id: "document_02",
//         //         title: "Starlight.doc",
//         //         report_id: "report_01",
//         //         // path: "pocket_01/report_01/document_02",
//         //     },
//         //     "document_03": {
//         //         className: "ReportInfo",
//         //         id: "document_03",
//         //         title: "Neptune.doc",
//         //         report_id: "report_01",
//         //         // path: "pocket_01/report_01/document_02",
//         //     }
//         // }
//     }
// ]

// const mockServerData = [
//     {
//         id: "pocket_01",
//         type: "pocket",
//         title: "Air Space Pocket",
//         childNodes: [
//             {
//                 id: "report_01",
//                 type: "report",
//                 name: "Report: Air Space",
//                 properties: {
//                     location: "extra prop",
//                 },
//                 childNodes: [
//                     {
//                         id: "document_01",
//                         type: "document",
//                         name: "Solar Flares.doc",
//                         properties: {
//                             location: "extra prop",
//                         },
//                     },
//                     {
//                         id: "document_02",
//                         type: "document",
//                         name: "Starlight.doc",
//                         properties: {
//                             location: "extra prop",
//                         },
//                     },
//                     {
//                         id: "document_03",
//                         type: "document",
//                         name: "Neptune.doc",
//                         properties: {
//                             location: "extra prop",
//                         },
//                     }
//                 ]
//             },
//         ]
//     },
//     {
//         id: "pocket_02",
//         type: "pocket",
//         name: "High School Pocket",
//         properties: {
//             location: "extra prop",
//         },
//         path: "pocket_02",
//     },
//     {
//         id: "pocket_03",
//         type: "pocket",
//         name: "Nose Injuries Pocket",
//         properties: {
//             location: "extra prop",
//         },
//         path: "pocket_03",
//     }
// ];


