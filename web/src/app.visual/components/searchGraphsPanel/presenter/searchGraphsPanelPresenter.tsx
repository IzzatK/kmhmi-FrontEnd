import {Component} from "react";
import {SearchGraphsPanelPresenterProps, SearchGraphsPanelPresenterState} from "../searchGraphsModel";
import {SearchGraphsPanelView} from "../views/searchGraphsPanelView";

class SearchGraphsPanelPresenter extends Component<SearchGraphsPanelPresenterProps, SearchGraphsPanelPresenterState> {
    constructor(props: any, context: any) {
        super(props, context);

        this.state = {
            isAlternate: false,
        }
    }

    _onToggleAlternate() {
        const { isAlternate } = this.state;
        this.setState({
            ...this.state,
            isAlternate: !isAlternate,
        })
    }


    render() {
        const {
            className,
            departmentData,
            purposeData,
            totalUploadsData,
            customTagsData,
            docTypeData,
            isExpanded,
            onSearchParamChanged,
            isLoading,
            hasError,
            errorMessage
        } = this.props;

        const { isAlternate } = this.state;

        return (
            <SearchGraphsPanelView
                className={className}
                onSearchParamChanged={onSearchParamChanged}
                departmentData={departmentData}
                purposeData={purposeData}
                totalUploadsData={totalUploadsData}
                customTagsData={customTagsData}
                docTypeData={docTypeData}
                isExpanded={isExpanded}
                isAlternate={isAlternate}
                onToggleAlternate={this._onToggleAlternate}
                isLoading={isLoading}
                hasError={hasError}
                errorMessage={errorMessage}
            />
        );
    }
}

export default SearchGraphsPanelPresenter;
