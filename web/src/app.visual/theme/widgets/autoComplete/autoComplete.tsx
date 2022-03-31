import {AutoCompleteProps, AutoCompleteState, SuggestionItemVM} from "./autoCompleteModel";
import React from "react";
import TextEdit from "../textEdit/textEdit";
import {bindInstanceMethods, Nullable} from "../../../../framework.core/extras/utils/typeUtils";
import {forEach} from "../../../../framework.core/extras/utils/collectionUtils";
import Portal from "../portal/portal";
import Button from "../button/button";
import {TextFormatHighlightSVG} from "../../svgs/textFormatHighlightSVG";

export class AutoComplete extends React.Component<AutoCompleteProps, AutoCompleteState> {

    private autoCompleteTimeout: Nullable<NodeJS.Timeout> = null;


    constructor(props: AutoCompleteProps, context: any) {
        super(props, context);

        this.state = {
            loadingSuggestions: false,
            showSuggestions: false,
            suggestions: []
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
                        showSuggestions: true
                    })
                    this.props.suggestionSupplier(value)
                        .then(result => {
                            if (result != null) {

                                console.log(`Suggestions Found: ${result ? result.length : 0}`);
                                forEach(result, (item: SuggestionItemVM) => {
                                    console.log(`id: ${item.id}, title: ${item.title}`);
                                })

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

    _onClickHandler() {
        this.setState({
            ...this.state,
            showSuggestions: false
        })
    }

    render() {
        const { ...rest } = this.props;

        const { suggestions, showSuggestions } = this.state;

        let items: JSX.Element[] = [];
        if (suggestions) {
            forEach(suggestions, (suggestion: SuggestionItemVM) => {
                items.push(
                    <Button key={suggestion.id}
                            text={suggestion.title}
                            onClick={() => {
                                // do something with the click event
                            }}
                    />
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
                    portalContent={(params: any) => {
                        const { relatedWidth=0 } = params;
                        return (
                            <div className={'ml-4 mt-2 d-flex'} style={{minWidth: relatedWidth}}>
                                <div className={`flex-fill d-flex flex-column w-100 bg-muted p-3 v-gap-2`}>
                                    {items}
                                </div>
                            </div>
                        )
                    }}>
                    <TextEdit onChange={this._onChange} {...rest} />
                </Portal>
            </div>
        )
    }
}