import PocketsPanelView from "./pocketsPanelView";
import {Presenter} from "../../../../framework.visual/extras/presenter";
import {createComponentWrapper} from "../../../../framework/wrappers/componentWrapper";

class PocketsPanel extends Presenter {
    constructor() {
        super();

        this.id ='components/pocketsPanel';

        this.view = PocketsPanelView;

        this.displayOptions = {
            containerId: 'system-tool-panel',
            visible: false,
            appearClass: 'fadeIn',
            enterClass: 'fadeIn',
        };

        this.mapStateToProps = (state: any, props: any) => {
            return {
                data: this.mockData
            }
        }

        this.mapDispatchToProps = (dispatch: any) => {
            return {
            };
        }
    }

    mockData = [
        {
            id: "pocket_01",
            type: "pocket",
            name: "Air Space Pocket",
            properties: {
                location: "extra prop",
            },
            childNodes: [
                {
                    id: "report_01",
                    type: "report",
                    name: "Report: Air Space",
                    properties: {
                        location: "extra prop",
                    },
                    childNodes: [
                        {
                            id: "document_01",
                            type: "document",
                            name: "Solar Flares.doc",
                            properties: {
                                location: "extra prop",
                            },
                        },
                        {
                            id: "document_02",
                            type: "document",
                            name: "Starlight.doc",
                            properties: {
                                location: "extra prop",
                            },
                        }
                    ]
                },
                {
                    id: "report_02",
                    type: "report",
                    name: "Neptune",
                    properties: {
                        location: "extra prop",
                    },
                }
            ]
        },
        {
            id: "pocket_02",
            type: "pocket",
            name: "High School Pocket",
            properties: {
                location: "extra prop",
            },
        },
        {
            id: "pocket_03",
            type: "pocket",
            name: "Nose Injuries Pocket",
            properties: {
                location: "extra prop",
            },
        }
    ];
}

export const {
    connectedPresenter: PocketsPanelPresenter,
    componentId: PocketsPanelId
} = createComponentWrapper(PocketsPanel);
