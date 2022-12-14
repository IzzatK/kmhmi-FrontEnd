import './searchBox.css';
import React from "react";
import Button from "../button/button";
import {SearchSVG} from "../../svgs/searchSVG";
import {bindInstanceMethods} from "../../../../framework.core/extras/utils/typeUtils";
import {SearchBoxProps, SearchBoxState} from "./searchBoxModel";

class SearchBox extends React.Component<SearchBoxProps, SearchBoxState> {

    constructor(props: SearchBoxProps, context: any) {
        super(props, context);

        this.state = {
            text: '',
            selected: false,
        }

        bindInstanceMethods(this);
    }


    componentDidMount() {
        this._setText(this.props.text || "");
    }

    componentDidUpdate(prevProps: SearchBoxProps, prevState: SearchBoxState, snapshot: any) {
        if (prevProps.text !== this.props.text) {
            this._setText(this.props.text || "");
        }
    }

    _setText(value: string) {
        this.setState({
            ...this.state,
            text: value
        })
    }

    _onTextUpdate(e: { target: { value: any; }; }) {
        if (this.props.onTextChange) {
            this.props.onTextChange(e.target.value);
        }
    }

    _onKeyPress (e: { key: string; }) {
        switch (e.key.toUpperCase()) {
            case 'ENTER':
                this._onSearch();
                break;
        }
    }

    _setSelected(focused: boolean) {
        this.setState({
            ...this.state,
            selected: focused,
        })
    }

    _onSearch() {
        const { onSearch, name } = this.props;
        const { text } = this.state;

        if (onSearch) {
            onSearch(name ? name : "", text);
        }
    }

    render() {
        const {className, onSearch, onTextChange, light, placeholder, ...rest} = this.props;

        const { text, selected } = this.state;

        let cn = "search-box d-flex align-items-stretch";
        if (className) {
            cn += ` ${className}`;
        }
        if (light) {
            cn += " light rounded-lg"
        }
        if (selected) {
            cn += " selected";
        }

        return (
            <div className={cn} {...rest}>
                <Button className={"rounded-0 border-0 btn-transparent"} onClick={this._onSearch}>
                    <SearchSVG className={"tiny-image-container"}/>
                </Button>
                <input className={"flex-fill px-2 display-4"} value={text} placeholder={placeholder ? placeholder : "Search"} onChange={this._onTextUpdate}
                       onKeyPress={this._onKeyPress} id={'searchBox'} onFocus={() => this._setSelected(true)} onBlur={() => this._setSelected(false)}/>
            </div>
        );
    }
}

export default SearchBox;
