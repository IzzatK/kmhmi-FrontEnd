import React, {Component, ReactNode} from 'react';
import './searchBanner.css';
import SearchBox from "../../theme/widgets/searchBox/searchBox";
import Button from "../../theme/widgets/button/button";
import {ParamType} from "../../../app.model";
import ComboBox from "../../theme/widgets/comboBox/comboBox";
import Portal from "../../theme/widgets/portal/portal";
import TextEdit from "../../theme/widgets/textEdit/textEdit";
import {ArrowDownSVG} from "../../theme/svgs/arrowDownSVG";
import {ArrowUpSVG} from "../../theme/svgs/arrowUpSVG";
import {SearchGraphsPanelId} from "../searchGraphsPanel/searchGraphsPanelPresenter";
import {bindInstanceMethods, Nullable} from "../../../framework/extras/typeUtils";
import {SearchBannerProps, SearchBannerState} from "./searchBannerModel";
import {MenuItemVM} from "../../../framework.visual/model/menuItemVM";

class SearchBannerView extends Component<SearchBannerProps, SearchBannerState> {

    constructor(props: any, context: any) {
        super(props, context);

        bindInstanceMethods(this);

        this.state = {
            showAdvanced: false
        }
    }

    componentDidMount() {
        const { onToolSelected } = this.props;
        onToolSelected(SearchGraphsPanelId);
    }

    _setShowAdvanced(value: boolean) {
        this.setState({
            ...this.state,
            showAdvanced: value
        })
    }

    _onSearchTextChanged(value: string) {
        const { onSearchTextChanged } = this.props;

        if (onSearchTextChanged) {
            onSearchTextChanged(value);
        }
    }

    _onTextChanged(id: string, value: string) {
        const { onSearchParamChanged } = this.props;

        if (onSearchParamChanged) {
            onSearchParamChanged(id, value);
        }
    }

    _onNumberChanged(id: string, value: string) {
        const { onSearchParamChanged } = this.props;

        if (onSearchParamChanged) {
            onSearchParamChanged(id, value);
        }
    }

    _onDateChanged(state: any, id: string, propertyId: string, propertyValue: string) {
        const { onSearchParamChanged } = this.props;

        let nextValue = {
            ...state,
            [propertyId]: propertyValue
        }

        if (onSearchParamChanged) {
            onSearchParamChanged(id, nextValue);
        }
    }

    _onTypeChanged(id: string, value: string | string[]) {
        const { onSearchParamChanged } = this.props;

        if (onSearchParamChanged) {
            onSearchParamChanged(id, value);
        }
    }

    _onClearSearch() {
        const { onClearSearch } = this.props;

        if (onClearSearch) {
            onClearSearch();
        }
    }

    _onSearch() {
        const { onSearch } = this.props;

        if (onSearch) {
            onSearch();
        }

        this._setShowAdvanced(false);
    }

    _onDone() {
        this._setShowAdvanced(false);
    }

    render() {
        const {
            className, onSearch, onSearchTextChanged, searchText, tools, onToolSelected, onClearSearch,
            searchParamsBasic, searchParamsAdvanced, onSearchParamChanged, ...rest
        } = this.props;

        const {
            showAdvanced
        } = this.state;

        let toolDivs: ReactNode[] = [];

        if (tools) {
            toolDivs = tools.map((tool: MenuItemVM) => {
                const {id, graphic:Graphic=null, title='', selected=false} = tool;
                return (
                    <Button key={id} onClick={() => onToolSelected(id)} selected={selected}>
                        <div className={'d-flex h-gap-3 align-items-center'}>
                            {
                                Graphic && <Graphic className={'small-image-container'}/>
                            }
                            <div className={'font-weight-semi-bold'}>{title}</div>
                        </div>
                    </Button>
                )
            })
        }

        let basicDivs = searchParamsBasic.map((item) => {
            let result = null;
            const {id, title='', value, options= null} = item;

            let cbTitle = title;
            let dirty = false;
            if (options && options[value]) {
                cbTitle = options[value].title;
                dirty = true;
            }

            let cbOptions = [
                {
                    id: 'all',
                    title: 'All'
                },
                ...Object.values(options)
            ]

            result = (
                <ComboBox key={id} className={dirty ? 'dirty rounded-lg' : 'rounded-lg'} light={true}
                          title={cbTitle || ''} items={cbOptions} multiSelect={true}
                          onSelect={(value: any) => this._onTypeChanged(id, value)}/>
            )
            return result;
        })

        let advancedDivs = searchParamsAdvanced.map((item) => {
            const {id, type, title='', dirty, value, options= null} = item;

            let cellRenderer = null;

            switch (type) {
                case ParamType.STRING: {
                    cellRenderer = (
                        <TextEdit dirty={dirty} edit={true} placeholder={title || ''} name={id} value={value} onSubmit={(id: string, value: string) => this._onTextChanged(id, value)}/>
                    )
                    break;
                }
                case ParamType.NUMBER: {
                    cellRenderer = (
                        <TextEdit dirty={dirty} edit={true} value={value} name={id} onSubmit={(id: string, value: string) => this._onTextChanged(id, value)}/>
                    )
                    break;
                }
                case ParamType.DATE_RANGE: {
                    const { start_date, end_date } = value || {};
                    cellRenderer = (
                        <div className={'d-flex h-gap-4 align-items-end'}>
                            <div className={'d-flex h-gap-2 align-items-center'}>
                                <TextEdit dirty={dirty} edit={true} type={'date'} value={start_date} onChange={(value) => this._onDateChanged(value, id, 'start_date', value)}/>
                            </div>
                            <div className={'d-flex align-items-end'}>
                                <div className={''}>to</div>
                            </div>
                            <div className={'d-flex h-gap-2 align-items-center'}>
                                <TextEdit dirty={dirty} edit={true} type={'date'} value={end_date} onChange={(value) => this._onDateChanged(value, id, 'end_date', value)}/>
                            </div>
                        </div>
                    )
                    break;
                }
                case ParamType.OPTIONS: {
                    let cbTitle = title;
                    let dirty = false;
                    if (options && options[value]) {
                        cbTitle = options[value].title;
                        dirty = true;
                    }

                    let cbOptions = {
                        'all': {
                            id: 'all',
                            title: 'All'
                        },
                        ...options
                    }

                    cellRenderer = (
                        <ComboBox className={dirty ? 'dirty rounded-lg' : 'rounded-lg'} light={true}
                                  title={cbTitle || ''} items={cbOptions} multiSelect={true}
                                  onSelect={(value: any) => this._onTypeChanged(id, value)}/>
                    )
                    break;
                }
                default: {
                    // cellRenderer = (
                    //     <div>NO RENDERER</div>
                    // )
                    break;
                }
            }

            let cn = "d-flex justify-content-between p-2 align-items-stretch h-gap-3";

            return (
                <div key={id} className={cn}>
                    <div className={'d-flex align-items-end'}>
                        <div className={'font-weight-semi-bold p-3'} style={{minWidth: '15rem'}}>{title}</div>
                    </div>
                    {cellRenderer}
                </div>
            )
        })

        let cn = 'd-flex';
        if (className) {
            cn += ` ${className}`;
        }

        const maxWidth = '61.0rem';

        let arrowSVG = <ArrowDownSVG className={''}/>;
        if (showAdvanced) {
            arrowSVG = <ArrowUpSVG className={''}/>;
        }

        return (
            <div className={cn} {...rest}>
                <div className={'flex-fill search-banner d-flex flex-column justify-content-center p-4 v-gap-5'}>
                    <div className={'align-items-stretch d-flex'}>
                        <div className={'flex-fill d-flex flex-column align-items-stretch v-gap-2'}>
                            <div className={'d-flex flex-wrap align-items-end'}>
                                <SearchBox className={'mr-3'}
                                           style={{minWidth: maxWidth, maxWidth: maxWidth}} light={true}
                                           onSearch={this._onSearch} text={searchText}
                                           onTextChange={this._onSearchTextChanged}/>
                                <div className={'d-flex h-gap-2 align-items-end mt-3'} >
                                    {basicDivs}


                                    <Portal
                                        isOpen={showAdvanced}
                                        zIndex={9999}
                                        enterClass={'growVertical'}
                                        exitClass={'shrinkVertical'}
                                        timeout={200}
                                        autoLayout={false}
                                        onShouldClose={null}
                                        portalContent={
                                            ({}) =>
                                            <div className={'portal position-absolute'}
                                            >
                                                <div className={'advanced d-flex flex-column v-gap-5 shadow mt-3'}>
                                                    <div>
                                                        {advancedDivs}
                                                    </div>
                                                    <div className={'d-flex flex-fill justify-content-end align-items-end'}>
                                                        <div className={'d-flex flex-fill justify-content-end align-items-end footer p-4'}>
                                                            <Button light={true} onClick={this._onDone}>Done</Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        }>
                                        <Button className={'combo-box-button'} orientation={"horizontal"} onClick={((event) => this._setShowAdvanced(!showAdvanced))}>
                                            <div className={"flex-fill"}>More</div>
                                            <div className={"d-flex align-items-center tiny-image-container combo-box-arrow pe-none"}>{arrowSVG}</div>
                                        </Button>
                                    </Portal>

                                </div>
                                <div className={'ml-3 mt-3 exclude-item'}>
                                    <Button className={'combo-box-button'} onClick={this._onClearSearch}>
                                        <div className={"header-3 flex-fill"}>Clear</div>
                                    </Button>
                                </div>

                            </div>
                            <div className={"d-flex justify-content-between"} style={{maxWidth: maxWidth}}>
                                <div className={"d-flex h-gap-4"}>
                                    { toolDivs }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default SearchBannerView;
