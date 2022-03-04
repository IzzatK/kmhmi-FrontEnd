import React, {Component} from 'react';
import './pocketsPanel.css';
import '../../../theme/stylesheets/panel.css';
import ScrollBar from "../../../theme/widgets/scrollBar/scrollBar";
import TreeView from "../../../theme/widgets/treeView/treeView";
import {bindInstanceMethods} from "../../../../framework.core/extras/typeUtils";
import {PocketNodeView} from "./pocketNodeView";
import Button from "../../../theme/widgets/button/button";
import {ShareSVG} from "../../../theme/svgs/shareSVG";
import {DownloadSVG} from "../../../theme/svgs/downloadSVG";
import {SettingsSVG} from "../../../theme/svgs/settingsSVG";
import {RemoveSVG} from "../../../theme/svgs/removeSVG";
import {PocketsPanelProps} from "./pocketsPanelModel";

class PocketsPanelView extends Component<PocketsPanelProps> {
    constructor(props: any, context: any) {
        super(props, context);

        bindInstanceMethods(this);
    }

    getCellContentRenderer(node: any) {
        let actions = null;
        let cn = "";

        switch (node.type) {
            case 'pocket':
                actions = (
                    <React.Fragment>
                        <Button>
                            <ShareSVG className={"small-image-container"}/>
                        </Button>
                        <Button>
                            <DownloadSVG className={"small-image-container"}/>
                        </Button>
                        <Button>
                            <SettingsSVG className={"small-image-container"}/>
                        </Button>
                    </React.Fragment>
                )
                cn = "pocket display-3 p-4";
                break;
            case 'report':
                cn = "report display-2 px-3 pt-3 pb-5";
                break;
            case 'document':
                actions = (
                    <React.Fragment>
                        <Button>
                            <DownloadSVG className={"small-image-container"}/>
                        </Button>
                        <Button>
                            <RemoveSVG className={"small-image-container"}/>
                        </Button>
                    </React.Fragment>
                )
                cn = "document display-2 px-3 pt-3 pb-5";
                break;
            case 'excerpt':
                break;
            default:
                break;
        }

        return (
            <PocketNodeView className={cn} title={node.name} subTitle={''} actions={actions} onSelect={this.onSelect} id={node.id} path={node.path}/>
        )
    }

    onSelect(path: string, selected: boolean) {
        if (selected) {
            this.props.addSelectionPath(path);
        }
        else {
            this.props.removeSelectionPath(path);
        }
    }

    render() {
        const { className, data, selectionPaths } = this.props;

        let cn = "d-flex position-absolute w-100 h-100 align-items-center justify-content-center";

        if (className) {
            cn += ` ${className}`;
        }

        return (
            <div className={cn}>
                <div className={'system-tool-panel pockets-panel flex-fill h-100 p-4 d-flex flex-column'}>
                    <div className={'header-1 title py-3'}>POCKETS MANAGER</div>

                    <div className={"d-flex justify-content-between px-3"}>
                        <Button text={"Sort"}/>
                        <Button text={"Create Pocket"}/>
                    </div>
                    <div className={'flex-fill'}>
                        <ScrollBar className={'flex-fill'} renderTrackHorizontal={false}>
                            <TreeView selectionPaths={selectionPaths} data={data} cellContentRenderer={this.getCellContentRenderer}/>
                        </ScrollBar>
                    </div>
                </div>
            </div>
        );
    }
}

export default PocketsPanelView;
