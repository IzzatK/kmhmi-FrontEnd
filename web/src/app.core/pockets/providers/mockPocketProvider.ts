import {EntityProvider} from "../../common/providers/entityProvider";
import {PocketInfo} from "../../../app.model";
import {IRepoItem, RepoItem} from "../../../framework.core/services/repoService/repoItem";
import {Nullable} from "../../../framework.core/extras/typeUtils";
import {IWocketInfo} from "../../../app.model/pockets/wocketInfo";

export const serverUrl = process.env.REACT_APP_SERVER_URL;

export class MockPocketProvider extends EntityProvider<IWocketInfo[]> {
    baseUrl: string = `${serverUrl}/pockets`;
    public static class: string = 'MockPocketProvider';

    constructor() {
        super();
        super.appendClassName(MockPocketProvider.class);
    }

    start() {
        super.start();
    }


    getAll(uiRequestData?: any): Promise<IWocketInfo[]> {
        return new Promise((resolve, reject) => {
            resolve(mockHMIData);
        });
    }

    getSingle(id: string): Promise<Nullable<IWocketInfo[]>> {
        return new Promise((resolve, reject) => {
            resolve(null);
        });
    }


    remove(id: string): Promise<Nullable<IWocketInfo[]>> {
        return new Promise((resolve, reject) => {
            let repoItem: Nullable<IRepoItem> = null;

            mockHMIData = mockHMIData.filter((item:IWocketInfo) => {
                if (item.id === id) {
                    repoItem = item;
                }
                return item.id !== id;
            });

            resolve(repoItem);
        });
    }
}

let mockHMIData = [
    [
        {
            className: "PocketInfo",
            id: "pocket_01",
            name: "Air Space Pocket",
            path: "pocket_01",
        },
        {
            className: "ReportInfo",
            id: "report_01",
            pocket_id: "pocket_01",
            name: "Report: Air Space",
            path: "pocket_01/report_01",
        },
        {
            className: "ReportDocumentInfo",
            id: "document_01",
            report_id: "report_01",
            name: "Solar Flares.doc",
            path: "pocket_01/report_01/document_01",
        },
        {
            className: "ReportDocumentInfo",
            id: "document_02",
            report_id: "report_01",
            name: "Starlight.doc",
            path: "pocket_01/report_01/document_02",
        },
        {
            className: "ReportInfo",
            id: "document_03",
            report_id: "report_01",
            name: "Neptune.doc",
            path: "pocket_01/report_01/document_02",
        },
        {
            className: "PocketInfo",
            id: "pocket_02",
            name: "High School Pocket",
            path: "pocket_02",
        },
        {
            className: "PocketInfo",
            id: "pocket_03",
            name: "Nose Injuries Pocket",
            path: "pocket_03",
        }
    ]

];

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


