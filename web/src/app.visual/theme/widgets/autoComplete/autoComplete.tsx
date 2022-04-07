import {AutoCompleteProps, AutoCompleteState, SuggestionItemVM} from "./autoCompleteModel";
import React from "react";
import TextEdit from "../textEdit/textEdit";
import {bindInstanceMethods, Nullable} from "../../../../framework.core/extras/utils/typeUtils";
import {forEach} from "../../../../framework.core/extras/utils/collectionUtils";
import Portal from "../portal/portal";
import {LoadingIndicator} from "../loadingIndicator/loadingIndicator";
import {Size} from "../loadingIndicator/loadingIndicatorModel";
import './auto-complete.css';
import SearchBox from "../searchBox/searchBox";

export class AutoComplete extends React.Component<AutoCompleteProps, AutoCompleteState> {

    private autoCompleteTimeout: Nullable<NodeJS.Timeout> = null;

    constructor(props: AutoCompleteProps, context: any) {
        super(props, context);

        this.state = {
            loadingSuggestions: false,
            showSuggestions: false,
            suggestions: [],
            value: "",
        }

        bindInstanceMethods(this);
    }

    private _onChange(value: string) {

        if (this.props.onChange != null) {
            this.props.onChange(value);
        }

        if (this.autoCompleteTimeout != null) {
            clearTimeout(this.autoCompleteTimeout);
        }

        if (this.props.suggestionSupplier != null && value.length > 0 ) {
            this.autoCompleteTimeout = setTimeout(() => {

                if (this.props.suggestionSupplier != null) {
                    this.setState({
                        ...this.state,
                        loadingSuggestions: true,
                        showSuggestions: true,
                        value,
                    })
                    this.props.suggestionSupplier(value)
                        .then(result => {
                            if (result != null) {

                                this.setState({
                                    ...this.state,
                                    suggestions: result,
                                    loadingSuggestions: false,
                                    showSuggestions: true
                                })
                            }
                        });

                }
            }, 250);
        }
        else {
            this.setState({
                suggestions: [],
                loadingSuggestions: false,
                showSuggestions: false
            })
        }
    }

    _onSubmit(name: string, value: string) {
        if (this.props.onSubmit) {
            this.props.onSubmit(name, value);
        }
    }

    _onClickHandler() {
        this.setState({
            ...this.state,
            showSuggestions: false
        })
    }

    render() {
        const { onSubmit, onChange, isSearch, ...rest } = this.props;
        const { value } = this.state;

        const { suggestions, showSuggestions, loadingSuggestions } = this.state;

        let items: JSX.Element[] = [];
        if (suggestions) {
            forEach(suggestions, (suggestion: SuggestionItemVM) => {
                let matched_text = suggestion.title.slice(0, value.length);
                let text = suggestion.title.slice(value.length, suggestion.title.length);

                items.push(
                    <div
                        key={suggestion.id}
                        className={"d-flex display-4 cursor-pointer"}
                         onClick={(event) => {
                             this._onSubmit(this.props.name || '', suggestion.id);
                         }}
                    >
                        <div className={"match font-weight-bold"}>{matched_text}</div>
                        <div className={"text-info"}>{text}</div>
                    </div>

                )
            })
        }

        return (
            <div>
                <Portal
                    isOpen={showSuggestions}
                    zIndex={9999}
                    enterClass={'growVertical'}
                    exitClass={'shrinkVertical'}
                    timeout={200}
                    autoLayout={false}
                    onShouldClose={this._onClickHandler}
                    className={"auto-complete"}
                    portalContent={(params: any) => {
                        const { relatedWidth=0 } = params;
                        return (
                            <div className={'auto-complete-container ml-4 mt-2 d-flex shadow shadow-lg overflow-scroll-y'} style={{minWidth: relatedWidth*2, maxHeight: '15.0rem'}}>
                                <div className={`flex-fill d-flex flex-column w-100`}>
                                    {
                                        loadingSuggestions ?
                                            <div className={'d-flex align-items-center justify-content-center'}>
                                                <LoadingIndicator size={Size.nano}/>
                                            </div>
                                            :
                                            <ul className={'v-gap-2 p-3'}>
                                                {items}
                                            </ul>

                                    }
                                </div>
                            </div>
                        )
                    }}>
                    {
                        isSearch ?
                            <SearchBox onTextChange={this._onChange} onSearch={this._onSubmit} {...rest}/>
                            :
                            <TextEdit manualFocus={true} onChange={this._onChange} onSubmit={this._onSubmit} {...rest} />
                    }
                </Portal>
            </div>
        )
    }
}
