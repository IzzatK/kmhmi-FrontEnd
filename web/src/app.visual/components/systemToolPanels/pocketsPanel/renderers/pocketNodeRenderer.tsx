import React, {Component} from "react";
import {PocketNodeRendererProps, PocketNodeRendererState, PocketTabType} from "../pocketsPanelModel";
import Button from "../../../../theme/widgets/button/button";
import {ShareSVG} from "../../../../theme/svgs/shareSVG";
import {DownloadSVG} from "../../../../theme/svgs/downloadSVG";
import {SettingsSVG} from "../../../../theme/svgs/settingsSVG";
import {bindInstanceMethods} from "../../../../../framework.core/extras/utils/typeUtils";
import TextEdit from "../../../../theme/widgets/textEdit/textEdit";

export class PocketNodeRenderer extends Component<PocketNodeRendererProps, PocketNodeRendererState> {
    constructor(props: any) {
        super(props);

        bindInstanceMethods(this);

        this.state = {
            tab: PocketTabType.NONE,
            edits: {
                id: this.props.id
            }
        }
    }


    componentDidUpdate(prevProps: Readonly<PocketNodeRendererProps>, prevState: Readonly<PocketNodeRendererState>, snapshot?: any) {
        if (prevProps != this.props) {
            this.setState({
                ...this.state,
                edits: {
                    id: this.props.id
                }
            })
        }
    }

    _onShare(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        event.stopPropagation();

        this._onToggleTab(PocketTabType.SHARE);
    }

    _onDownload(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        event.stopPropagation();

        this._onToggleTab(PocketTabType.DOWNLOAD);
    }

    _onSettings(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        event.stopPropagation();

        this._onToggleTab(PocketTabType.SETTINGS);
    }

    _onSave(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        event.stopPropagation();

        if (this.props.onSave != null) {
            this.props.onSave(this.state.edits);
        }
    }

    private _onPropertyUpdate(name: string, value: string) {
        this.setState({
            ...this.state,
            edits: {
                ...this.state.edits,
                [name]: value
            }
        })
    }

    private _cancelUpdates(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        event.stopPropagation();

        this.setState({
            ...this.state,
            edits: {
                id: this.props.id
            }
        })
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
            <div className={'flex-fill d-flex flex-column v-gap-2 p-2'}>
                <div className={'d-flex align-items-center justify-content-start h-gap-3 py-3'}>
                    <div>Name</div>
                    <TextEdit name={'title'} value={this.state.edits.title || this.props.title}
                              onChange={(value: string) => this._onPropertyUpdate('title', value)} />
                </div>
                <div className={'d-flex h-gap-3 justify-content-end'}>
                    <Button text={'Cancel'} onClick={this._cancelUpdates}/>
                    <Button text={'Save'} onClick={this._onSave}/>
                </div>
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
                    <div className={`action-bar d-flex h-gap-3 ${this.state.tab != PocketTabType.NONE && 'open'}`}>
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
