import React, {Component} from "react";
import {PocketNodeRendererProps, PocketNodeRendererState, PocketTabType} from "../pocketsPanelModel";
import Button from "../../../theme/widgets/button/button";
import {ShareSVG} from "../../../theme/svgs/shareSVG";
import {DownloadSVG} from "../../../theme/svgs/downloadSVG";
import {bindInstanceMethods} from "../../../../framework.core/extras/utils/typeUtils";
import TextEdit from "../../../theme/widgets/textEdit/textEdit";
import SearchBox from "../../../theme/widgets/searchBox/searchBox";
import {RemoveSVG} from "../../../theme/svgs/removeSVG";
import {EditSVG} from "../../../theme/svgs/editSVG";
import {LoadingIndicator} from "../../../theme/widgets/loadingIndicator/loadingIndicator";
import {Size} from "../../../theme/widgets/loadingIndicator/loadingIndicatorModel";
import {CopyPocketSVG} from "../../../theme/svgs/copyPocketSVG";

export class PocketNodeRenderer extends Component<PocketNodeRendererProps, PocketNodeRendererState> {
    constructor(props: any) {
        super(props);

        bindInstanceMethods(this);

        this.state = {
            tab: PocketTabType.NONE,
            edits: {
                id: '',
            },
        }
    }

    componentDidMount() {
        const { id } = this.props;

        this.setState({
            ...this.state,
            edits: {
                id,
            }
        });
    }

    componentDidUpdate(prevProps: Readonly<PocketNodeRendererProps>, prevState: Readonly<PocketNodeRendererState>, snapshot?: any) {
        if (prevProps != this.props) {
            const { id } = this.props;

            this.setState({
                ...this.state,
                edits: {
                    id,
                }
            });
        }
    }

    private _onShare(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        event.stopPropagation();

        this._onToggleTab(PocketTabType.SHARE);
    }

    private _onDownload(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        event.stopPropagation();

        this._onToggleTab(PocketTabType.DOWNLOAD);
    }

    private _onSettings(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        event.stopPropagation();

        this._onToggleTab(PocketTabType.EDIT);
    }

    private _onSave(value: string) {
        const { onSave } = this.props;
        const { edits } = this.state;

        if (onSave && value !== "") {
            onSave(edits);
            this._onToggleTab(PocketTabType.NONE);
        }
    }

    private _onPropertyUpdate(name: string, value: string) {
        const { edits } = this.state;

        this.setState({
            ...this.state,
            edits: {
                ...edits,
                [name]: value
            }
        })
    }

    private _onToggleTab(tab: PocketTabType) {
        let nextTab: PocketTabType = PocketTabType.NONE;
        if (this.state.tab !== tab) {
            nextTab = tab;
        }
        this.setState({
            ...this.state,
            tab: nextTab
        })
    }

    private _onSearch() {
        const { onSearch } = this.props;

        if (onSearch) {
            onSearch();
        }
    }

    private _onSearchTextChanged(value: string) {
        const { onSearchTextChanged } = this.props;

        if (onSearchTextChanged) {
            onSearchTextChanged(value);
        }
    }

    private _onDelete() {
        const { onDelete, id } = this.props;

        if (onDelete) {
            onDelete(id);
        }
    }

    renderShareTab() {
        const { searchText } = this.props;

        return (
            <div className={'flex-fill d-flex align-items-center justify-content-center p-4'}>
                <SearchBox
                    className={""}
                    placeholder={"Search for User"}
                    onSearch={this._onSearch}
                    text={searchText}
                    onTextChange={this._onSearchTextChanged}
                />
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
        const { className, title, isUpdating } = this.props;
        const { tab } = this.state;

        let cn = 'pocket-node dark d-flex flex-column';
        if (className) {
            cn += ` ${className}`;
        }

        return (
            <div className={cn}>
                <div className={'pocket-header d-flex justify-content-between'}>
                    <div className={"d-flex flex-row v-gap-2 justify-content-center align-items-center"}>
                        {
                            tab === PocketTabType.EDIT ?
                                <TextEdit
                                    name={'title'}
                                    value={title}
                                    onChange={(value: string) => this._onPropertyUpdate('title', value)}
                                    placeholder={"Type Pocket Name Here"}
                                    autoFocus={true}
                                    onSubmit={(name, value) => this._onSave(value)}
                                />
                                :
                                <div className={"title"}>{title}</div>
                        }
                    </div>
                    {
                        isUpdating ?
                            <div className={"d-flex"}>
                                <LoadingIndicator className={"mr-4"} size={Size.nano}/>
                            </div>
                            :
                            <div className={`action-bar d-flex h-gap-3 ${tab !== PocketTabType.NONE && 'open'}`}>
                                <Button className={"btn-transparent"} onClick={this._onSettings} selected={tab === PocketTabType.EDIT} tooltip={"Edit"}>
                                    <EditSVG className={"small-image-container"}/>
                                </Button>
                                <Button className={"btn-transparent"} onClick={(e) => {e.stopPropagation()}} selected={tab === PocketTabType.NONE} tooltip={"Copy Pocket"}>
                                    <CopyPocketSVG className={"small-image-container"}/>
                                </Button>
                                <Button className={"btn-transparent"} onClick={this._onShare} selected={tab === PocketTabType.SHARE} tooltip={"Share"}>
                                    <ShareSVG className={"small-image-container"}/>
                                </Button>
                                <Button className={"btn-transparent"} onClick={this._onDownload} selected={tab === PocketTabType.DOWNLOAD} tooltip={"Download"}>
                                    <DownloadSVG className={"small-image-container"}/>
                                </Button>
                                <Button className={"btn-transparent"} onClick={this._onDelete} selected={tab === PocketTabType.NONE} tooltip={"Remove"}>
                                    <RemoveSVG className={"small-image-container"}/>
                                </Button>
                            </div>
                    }
                </div>

                <div className={'pocket-body d-flex align-items-stretch cursor-auto'} onClick={(e) => e.stopPropagation()}>
                    {
                        tab === PocketTabType.SHARE &&
                        this.renderShareTab()
                    }
                    {
                        tab === PocketTabType.DOWNLOAD &&
                        this.renderDownloadTab()
                    }
                </div>

            </div>
        )
    }
}
