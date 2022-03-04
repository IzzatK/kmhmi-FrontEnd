import React from 'react';
import './searchView.css';

import {SearchViewProps} from "./searchModel";

export class SearchView extends React.Component<SearchViewProps> {
    render() {
        return (
            <div id={'search-view'} className={'display-1, text-secondary'}>
                {this.props.viewModel?.counter}
            </div>
        );
    }
}

