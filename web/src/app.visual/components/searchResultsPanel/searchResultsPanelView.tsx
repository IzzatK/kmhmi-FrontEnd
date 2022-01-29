import React, {Component} from 'react';
import './searchResultsPanel.css';
import Button from "../../theme/widgets/button/button";
import {CSSTransition} from "react-transition-group";
import {getClassNames} from "../../../framework.visual/extras/utils/animationUtils";
import ComboBox from "../../theme/widgets/comboBox/comboBox";
import {SortSVG} from "../../theme/svgs/sortSVG";
import {LoadingIndicator} from "../../theme/widgets/loadingIndicator/loadingIndicator";
import {PageWidth, SearchResultsProps, SearchResultsState} from "./searchResultsModel";
import {SearchResultsMenuItem} from "../../model/searchResultsMenuItem";
import {forEach} from "../../../framework.visual/extras/utils/collectionUtils";

class SearchResultsPanelView extends Component<SearchResultsProps, SearchResultsState> {
    private resizeObserver: ResizeObserver;

    constructor(props: any, context: any) {
        super(props, context);

        this.state = {
            pageWidth: PageWidth.FULL,
        }

        this.resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                if (entry.contentRect) {
                    const width = entry.contentRect.width;
                    if (width > 1850) {
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
        this.resizeObserver.observe(element != null ? element : new Element());
    }

    render() {
        const { className, searchResults, onDocumentSelected, resultViews, onResultViewSelected, userLookup,
            sortTypes, selectedSort, onSortSelected, isLoading, hasError, errorMessage, selectedResultView } = this.props;

        // select how to render the results
        let ResultRenderer = null;
        if (selectedResultView) {
            if (resultViews[selectedResultView] != null) {
                ResultRenderer = resultViews[selectedResultView].context;
            }
        }

        let cn = "d-flex";
        if (className) {
            cn += ` ${className}`;
        }
        if (isLoading) {
            cn += ` pe-none`;
        }

        let resultViewDivs: JSX.Element[] = [];
        forEach(resultViews, (resultView: SearchResultsMenuItem) => {
            const {id, title='test', graphic:Graphic, selected} = resultView;

            let item = (
                <div key={id}>
                    <Button tooltip={title} selected={selected} onClick={() => onResultViewSelected(id)}>
                        <Graphic className={'small-image-container'}/>
                    </Button>
                </div>
            )
            resultViewDivs.push(item);
        })

        const { title:sortTitle='Sort' } = selectedSort || {};

        return (
            <div className={cn} id={'search-results-panel'}>
                <div className={'flex-fill search-results-panel d-flex flex-column align-items-center justify-content-center py-4 pl-4 v-gap-5 position-relative'}>
                    <div className={'d-flex flex-fill w-100 pr-4'}>
                        {
                            searchResults && searchResults.length > 0 &&
                            <div className={'d-flex flex-fill'}>
                                <div className={'justify-content-start'}>
                                    <ComboBox
                                        className={'rounded-lg'}
                                        style={{minWidth:'23.5rem'}}
                                        onSelect={onSortSelected}
                                        title={sortTitle || ""}
                                        graphic={SortSVG}
                                        items={sortTypes}
                                        light={true}
                                    />

                                </div>
                                <div className={'d-flex flex-fill justify-content-end h-gap-3'}>
                                    {resultViewDivs}
                                </div>
                            </div>

                        }
                    </div>
                    <CSSTransition in={searchResults && searchResults.length > 0} appear={true} timeout={300}
                                   classNames={getClassNames('fadeIn', 'fadeIn', '')} unmountOnExit={true} >
                        <div className={"search-results h-100 w-100"}>
                            {
                                ResultRenderer &&
                                <ResultRenderer searchResults={searchResults} onDocumentSelected={onDocumentSelected}
                                                userLookup={userLookup} pageWidth={this.state.pageWidth}/>
                            }
                        </div>
                    </CSSTransition>
                    {
                        isLoading &&
                        <div className={"position-absolute exclude-item mr-4"} style={{top: '0', right: '0', bottom: '0', left:'0'}}>
                            <LoadingIndicator/>
                        </div>
                    }
                    {
                        hasError &&
                        <div className={"position-absolute exclude-item mr-4"} style={{top: '0', right: '0', bottom: '0', left:'0'}}>
                            <div className={'w-100 h-100 d-flex flex-fill align-items-center justify-content-center text-secondary'}>
                                <div className={'text-pre-wrap'} > {errorMessage}</div>
                            </div>
                        </div>
                    }
                </div>
            </div>
        );
    }
}

export default SearchResultsPanelView;
