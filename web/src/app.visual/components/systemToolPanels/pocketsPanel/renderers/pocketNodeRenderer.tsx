import React, {Component} from "react";
import {PocketNodeRendererProps, PocketNodeRendererState, PocketTabType} from "../pocketsPanelModel";
import Button from "../../../../theme/widgets/button/button";
import {ShareSVG} from "../../../../theme/svgs/shareSVG";
import {DownloadSVG} from "../../../../theme/svgs/downloadSVG";
import {SettingsSVG} from "../../../../theme/svgs/settingsSVG";
import {bindInstanceMethods} from "../../../../../framework.core/extras/utils/typeUtils";

export class PocketNodeRenderer extends Component<PocketNodeRendererProps, PocketNodeRendererState> {
    constructor(props: any) {
        super(props);

        bindInstanceMethods(this);

        this.state = {
            tab: PocketTabType.NONE
        }
    }

    _onShare(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        event.stopPropagation();

        if (this.props.onShare != null) {
            this.props.onShare(this.props.id);
        }

        this._onToggleTab(PocketTabType.SHARE);
    }

    _onDownload(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        event.stopPropagation();

        if (this.props.onDownload != null) {
            this.props.onDownload(this.props.id);
        }

        if (this.state.tab == PocketTabType.DOWNLOAD) {

        }

        this._onToggleTab(PocketTabType.DOWNLOAD);
    }

    _onSettings(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        event.stopPropagation();

        if (this.props.onSettings != null) {
            this.props.onSettings(this.props.id);
        }

        this._onToggleTab(PocketTabType.SETTINGS);
    }

    _onToggleTab(tab: PocketTabType) {
        let nextTab: PocketTabType = PocketTabType.NONE;
        if (this.state.tab != tab) {
            nextTab = tab;
        }
        this.setState({
            ...this.state,
            tab: nextTab
        })
    }

    renderShareTab() {
        return (
            <div className={'flex-fill d-flex align-items-center justify-content-center p-4'}>
                <div className={'display-4 text-primary'}>Share Screen</div>
            </div>
        )
    }

    renderSettingsTab() {
        return (
            <div className={'flex-fill d-flex align-items-center justify-content-center p-4'}>
                <div className={'display-4 text-primary'}>Settings Screen</div>
            </div>
        )
    }

    renderDownloadTab() {
        return (
            <div className={'flex-fill d-flex align-items-center justify-content-center p-4'}>
                <div className={'display-4 text-primary'}>Download Screen</div>
            </div>
        )
    }


    render() {
        const {className, title } = this.props;

        let cn = 'pocket-node dark d-flex flex-column';
        if (className) {
            cn += ` ${className}`;
        }

        return (
            <div className={cn}>
                <div className={'pocket-header d-flex justify-content-between'}>
                    <div className={"d-flex flex-row v-gap-2 justify-content-center align-items-center"}>
                        <div className={"title"}>{title ? title : ''}</div>
                    </div>
                    <div className={'action-bar d-flex h-gap-3'}>
                        <Button onClick={this._onShare} selected={this.state.tab == PocketTabType.SHARE}>
                            <ShareSVG className={"small-image-container"}/>
                        </Button>
                        <Button onClick={this._onDownload} selected={this.state.tab == PocketTabType.DOWNLOAD}>
                            <DownloadSVG className={"small-image-container"}/>
                        </Button>
                        <Button onClick={this._onSettings} selected={this.state.tab == PocketTabType.SETTINGS}>
                            <SettingsSVG className={"small-image-container"}/>
                        </Button>
                    </div>
                </div>

                <div className={'d-flex align-items-stretch'}>
                    {
                        this.state.tab == PocketTabType.SHARE &&
                        this.renderShareTab()
                    }
                    {
                        this.state.tab == PocketTabType.DOWNLOAD &&
                        this.renderDownloadTab()
                    }
                    {
                        this.state.tab == PocketTabType.SETTINGS &&
                        this.renderSettingsTab()
                    }
                </div>

            </div>
        )
    }
}
