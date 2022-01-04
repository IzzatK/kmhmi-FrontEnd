import TagsPanelView from "./tagsPanelView";
import {Presenter} from "../../../../framework.visual/extras/presenter";
import {createComponentWrapper} from "../../../../framework/wrappers/componentWrapper";

class TagsPanel extends Presenter {
    constructor() {
        super();

        this.id ='components/tagsPanel';

        this.view = TagsPanelView;

        this.displayOptions = {
            containerId: 'system-tool-panel',
            visible: false,
            appearClass: 'fadeIn',
            enterClass: 'fadeIn',
        };

        this.mapStateToProps = (state: any, props: any) => {
            return {

            }
        }

        this.mapDispatchToProps = (dispatch: any) => {
            return {

            };
        }
    }
}

export const {
    connectedPresenter: TagsPanelPresenter,
    componentId: TagsPanelId
} = createComponentWrapper(TagsPanel);
