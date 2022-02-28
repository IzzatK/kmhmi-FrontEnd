import React, {Component} from 'react';
import './pocketsPanel.css';
import '../../../theme/stylesheets/panel.css';
import {PocketsPanelProps, PocketsPanelState} from "./pocketsPanelModel";
import ScrollBar from "../../../theme/widgets/scrollBar/scrollBar";
import TreeView from "../../../theme/widgets/treeView/treeView";
import {bindInstanceMethods} from "../../../../framework/extras/typeUtils";
import {PocketNodeView} from "./pocketNodeView";
import Button from "../../../theme/widgets/button/button";

class PocketsPanelView extends Component<PocketsPanelProps, PocketsPanelState> {
    constructor(props: any, context: any) {
        super(props, context);

        bindInstanceMethods(this);
    }

    getCellContentRenderer(node: any, showHint: boolean) {
        let actions = null;

        switch (node.type) {
            case 'pocket':
                actions = (
                    <React.Fragment>
                        <Button text={'Share'} />
                        <Button text={'Download'} />
                        <Button text={'Settings'} />
                    </React.Fragment>
                )
                break;
            case 'report':
                actions = (
                    <React.Fragment>
                        <Button text={'Download'} />
                        <Button text={'Delete'} />
                    </React.Fragment>
                )
                break;
            case 'document':
                break;
            case 'excerpt':
                break;
            default:
                break;
        }

        return (
            <PocketNodeView title={node.name} subTitle={''} actions={actions}/>
        )
    }

    render() {
        const { className, data } = this.props;

        let cn = "d-flex";

        if (className) {
            cn += ` ${className}`;
        }

        return (
            <div className={cn}>
                <div className={'pockets-panel system-tool-panel flex-fill flex-column v-gap-5 p-4 d-flex'}>
                    <div className={'header-1 text-primary'}>Pockets Panel</div>
                    <div className={'flex-fill'}>
                        <ScrollBar className={'flex-fill'}>
                            <TreeView data={data} cellContentRenderer={this.getCellContentRenderer}/>
                        </ScrollBar>
                    </div>

                </div>

            </div>
        );
    }
}

export default PocketsPanelView;
