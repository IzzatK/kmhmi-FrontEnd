import React, {Component} from 'react';
import '../views/tagsPanel.css';
import '../../../../theme/stylesheets/panel.css';
import {
    TagsPanelPresenterProps,
    TagsPanelPresenterState
} from "../tagsPanelModel";
import TagsPanelView from "../views/tagsPanelView";
import {bindInstanceMethods} from "../../../../../framework.core/extras/utils/typeUtils";

class TagsPanelPresenter extends Component<TagsPanelPresenterProps, TagsPanelPresenterState> {
    constructor(props: any, context: any) {
        super(props, context);
        bindInstanceMethods(this);

        this.state = {
            selectedTag: "",
        }
    }

    _setSelected(id: string) {
        const { selectedTag } = this.state;
        const { onTagSelected } = this.props;

        if (id !== selectedTag) {
            this.setState({
                ...this.state,
                selectedTag: id,
            });
        } else {
            this.setState({
                ...this.state,
                selectedTag: "",
            });
        }

        if (onTagSelected) {
            onTagSelected(id);
        }
    }

    _onShouldClose(id: string) {
        const { selectedTag } = this.state;

        if (id === selectedTag) {
            this.setState({
                ...this.state,
                selectedTag: "",
            })
        }
    }

    render() {
        return (
            <TagsPanelView
                className={this.props.className}
                tags={this.props.tags}
                nominatedTags={this.props.nominatedTags}
                selectedTag={this.state.selectedTag}
                onTagSelected={this._setSelected}
                onShouldClose={this._onShouldClose}
            />
        )
    }
}

export default TagsPanelPresenter;
