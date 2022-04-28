import {Component} from "react";
import SearchBannerView from "../views/searchBannerView";
import {bindInstanceMethods} from "../../../../framework.core/extras/utils/typeUtils";
import {SearchBannerPresenterProps, SearchBannerPresenterState} from "../searchBannerModel";

class SearchBannerPresenter extends Component<SearchBannerPresenterProps, SearchBannerPresenterState> {
    constructor(props: any, context: any) {
        super(props, context);

        bindInstanceMethods(this);

        this.state = {
            showAdvanced: false
        }
    }

    componentDidMount() {
        const { onToolSelected } = this.props;
        // onToolSelected(SearchGraphsPanelId);
    }

    _onSetShowAdvanced(value: boolean) {
        this.setState({
            ...this.state,
            showAdvanced: value
        })
    }

    _onDateChanged(state: string, id: string, propertyId: string, propertyValue: string) {
        const { onSearchParamChanged } = this.props;

        let nextValue: {};

        if (state === "") {
            nextValue = {
                [propertyId]: propertyValue
            }
        } else {
            if (propertyId === "start_date") {
                nextValue = {
                    ["end_date"]: state,
                    [propertyId]: propertyValue
                }
            } else {
                nextValue = {
                    ["start_date"]: state,
                    [propertyId]: propertyValue
                }
            }

        }

        if (onSearchParamChanged) {
            onSearchParamChanged(id, nextValue);
        }
    }

    _onSearch() {
        const { onSearch } = this.props;

        if (onSearch) {
            onSearch();
        }

        this._onSetShowAdvanced(false);
    }

    render() {
        const {
            searchText,
            tools,
            searchParamsBasic,
            searchParamsAdvanced,
            onToolSelected,
            onSearchTextChanged,
            onSearchParamChanged,
            onClearSearch
        } = this.props;

        const { showAdvanced } = this.state;

        return (
          <SearchBannerView
              searchText={searchText}
              tools={tools}
              searchParamsBasic={searchParamsBasic}
              searchParamsAdvanced={searchParamsAdvanced}
              showAdvanced={showAdvanced}
              onToolSelected={onToolSelected}
              onSearchTextChanged={onSearchTextChanged}
              onSearchParamChanged={onSearchParamChanged}
              onClearSearch={onClearSearch}
              onSearch={this._onSearch}
              onDateChanged={this._onDateChanged}
              onSetShowAdvanced={this._onSetShowAdvanced}
          />
        );
    }
}

export default SearchBannerPresenter;
