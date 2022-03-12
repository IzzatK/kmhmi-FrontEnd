import {connect} from "react-redux";
import {createViewModelConnector} from "./viewModelWrapper";
import {createDisplayConnector} from "./displayWrapper";
import {createMetadataConnector} from "./metadataWrapper";
import {MetadataInfo} from "../../app.model";
import {displayService, repoService} from "../../serviceComposition";

export const createComponentWrapper = (presenterTemplate: any) => {
    const presenter = new presenterTemplate();
    const {id, metadataId, view: View, model, mapStateToProps, mapDispatchToProps, displayOptions } = presenter;

    // class ComponentWrapper extends Component {
    //     constructor(props) {
    //         super(props);
    //     }
    //
    //     render() {
    //         const { ...rest } = this.props;
    //
    //         return (
    //             <View {...rest}/>
    //         );
    //     }
    // }

    // call the component specific map states

    let connectedPresenter = View;

    if (mapStateToProps || mapDispatchToProps) {
        connectedPresenter = connect(mapStateToProps, mapDispatchToProps)(connectedPresenter);
    }

    // create view model and create
    if (model) {
        connectedPresenter = createViewModelConnector(connectedPresenter, id, model);
    }

    if (metadataId) {
        connectedPresenter = createMetadataConnector(connectedPresenter, metadataId);

        let metaDataInfo = new MetadataInfo(metadataId);
        repoService.addOrUpdateRepoItem(metaDataInfo)
    }

    if (displayOptions) {
        connectedPresenter = createDisplayConnector(connectedPresenter, id);

        // add node info to redux
        displayService.addNodeInfo(id, displayOptions);
    }


    return {
        componentId: id,
        connectedPresenter: connectedPresenter
    };
};
