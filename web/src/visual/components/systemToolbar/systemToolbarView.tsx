import React, {Component} from 'react';
import './systemToolbar.css';
import Toolbar from "../../theme/widgets/toolbar/toolbar";
import Button from "../../theme/widgets/button/button";
import {DocPreviewSVG} from "../../theme/svgs/docPreviewSVG";
import {SystemToolbarProps, SystemToolbarState} from "./systemToolbarModel";

class SystemToolbarView extends Component<SystemToolbarProps, SystemToolbarState> {
    constructor(props: any, context: any) {
        super(props, context);
    }

    render() {
        const { className, tools, onToolSelected, documentPreviewTool, onDocumentPreviewSelected, ...rest } = this.props;

        let cn = "system-toolbar px-2 py-4 d-flex align-items-top justify-content-center";

        if (className) {
            cn += ` ${className}`;
        }

        let toolbarDiv = null;
        if (tools) {
            toolbarDiv = <Toolbar tools={tools} onToolSelected={onToolSelected} orientation={'vertical'}/>
        }

        const {selected:docSelected, title: docTitle} = documentPreviewTool;

        return (
            <div className={cn} {...rest}>
                <div className={'d-flex flex-column v-gap-3'}>
                    <div className={'tool-item'}>
                        <Button tooltip={docTitle} onClick={onDocumentPreviewSelected} selected={docSelected}>
                            <DocPreviewSVG className={'small-image-container'}/>
                        </Button>
                    </div>
                    <div className={"border-top align-self-stretch justify-self-stretch border-muted"}/>
                    {toolbarDiv}
                </div>
            </div>
        );
    }
}

export default SystemToolbarView;
