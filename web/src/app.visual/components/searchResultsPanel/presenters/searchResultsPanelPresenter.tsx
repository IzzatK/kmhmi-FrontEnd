import {Component} from "react";
import {bindInstanceMethods} from "../../../../framework.core/extras/utils/typeUtils";
import {
    ObjectType,
    PageWidth,
    SearchResultsPanelPresenterProps,
    SearchResultsPanelPresenterState
} from "../searchResultsModel";
import SearchResultsPanelView from "../views/searchResultsPanelView";

class SearchResultsPanelPresenter extends Component<SearchResultsPanelPresenterProps, SearchResultsPanelPresenterState> {

    private resizeObserver: ResizeObserver;

    constructor(props: any, context: any) {
        super(props, context);
        bindInstanceMethods(this);

        this.state = {
            pageWidth: PageWidth.FULL,
        }

        this.resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                if (entry.contentRect) {
                    const width = entry.contentRect.width;
                    if (width > 1800) {
                        this.setState({
                            ...this.state,
                            pageWidth: PageWidth.FULL,
                        })
                    } else if (width > 900) {
                        this.setState({
                            ...this.state,
                            pageWidth: PageWidth.ONE_HALF,
                        })
                    } else {
                        this.setState({
                            ...this.state,
                            pageWidth: PageWidth.ONE_THIRD,
                        })
                    }
                }
            }
        })
    }

    componentDidMount() {
        let element = document.getElementById('search-results-panel');
        if (element) {
            this.resizeObserver.observe(element);
        }
    }

    componentWillUnmount() {
        this.resizeObserver.disconnect();
    }

    _onCopy(id: string, object_type: ObjectType) {

    }

    _onEdit(id: string, object_type: ObjectType) {

    }

    _onShare(id: string, object_type: ObjectType) {

    }


    render() {
        const {
            className,
            searchResults,
            onDocumentSelected,
            resultViews,
            onResultViewSelected,
            userLookup,
            sortTypes,
            selectedSort,
            onSortSelected,
            isLoading,
            hasError,
            errorMessage,
            selectedResultView,
            selectedDocument,
            onDownload,
            onDelete,
            permissions
        } = this.props;
        const {
            pageWidth
        } = this.state;

        return (
            <SearchResultsPanelView
                className={className}
                searchResults={searchResults}
                onDocumentSelected={onDocumentSelected}
                resultViews={resultViews}
                onResultViewSelected={onResultViewSelected}
                userLookup={userLookup}
                sortTypes={sortTypes}
                selectedSort={selectedSort}
                onSortSelected={onSortSelected}
                isLoading={isLoading}
                hasError={hasError}
                errorMessage={errorMessage}
                selectedResultView={selectedResultView}
                selectedDocument={selectedDocument}
                pageWidth={pageWidth}
                onDownload={onDownload}
                onCopy={this._onCopy}
                onEdit={this._onEdit}
                onShare={this._onShare}
                onDelete={onDelete}
                permissions={permissions}
            />
        );
    }
}

export default SearchResultsPanelPresenter;
