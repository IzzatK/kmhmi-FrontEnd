import './searchBox.css';
import React from "react";
import Button from "../button/button";
import {SearchSVG} from "../../svgs/searchSVG";
import PropTypes from "prop-types";
import {bindInstanceMethods} from "../../../../framework/extras/typeUtils";
import {SearchBoxProps, SearchBoxState} from "./searchBoxModel";

class SearchBox extends React.Component<SearchBoxProps, SearchBoxState> {

    constructor(props: SearchBoxProps, context: any) {
        super(props, context);

        this.state = {
            text: ''
        }

        bindInstanceMethods(this);
    }


    componentDidMount() {
        this._setText(this.props.text);
    }

    componentDidUpdate(prevProps: SearchBoxProps, prevState: SearchBoxState, snapshot: any) {
        if (prevProps.text !== this.props.text) {
            this._setText(this.props.text);
        }
    }

    _setText(value: string | undefined) {
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
                if (this.props.onSearch) {
                    this.props.onSearch();
                }
                break;
        }
    }

    render() {
        const {className, onSearch, onTextChange, ...rest} = this.props;

        const { text } = this.state;

        let cn = "search-box d-flex rounded-lg align-items-stretch";
        if (className) {
            cn += ` ${className}`;
        }

        return (
            <div className={cn} {...rest}>
                <Button className={"rounded-0 border-0 btn-transparent"} onClick={onSearch}>
                    <SearchSVG className={"tiny-image-container"}/>
                </Button>
                <input className={"flex-fill px-2 display-4"} value={text} placeholder={"Search"} onChange={this._onTextUpdate}
                       onKeyPress={this._onKeyPress} id={'searchBox'}/>
            </div>
        );
    }
}

export default SearchBox;
