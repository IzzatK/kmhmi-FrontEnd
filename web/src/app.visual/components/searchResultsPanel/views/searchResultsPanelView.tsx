import React, {Component} from 'react';
import '../searchResultsPanel.css';
import {forEach} from "../../../../framework.core/extras/utils/collectionUtils";
import {SearchResultsMenuItem} from "../../../../app.model";
import Button from "../../../theme/widgets/button/button";
import ComboBox from "../../../theme/widgets/comboBox/comboBox";
import {SortSVG} from "../../../theme/svgs/sortSVG";
import {getClassNames} from "../../../../framework.visual";
import {LoadingIndicator} from "../../../theme/widgets/loadingIndicator/loadingIndicator";
import {CSSTransition} from "react-transition-group";
import {ObjectType, SearchResultsPanelViewProps} from "../searchResultsModel";
import {EditSVG} from "../../../theme/svgs/editSVG";
import {CopyPocketSVG} from "../../../theme/svgs/copyPocketSVG";
import {ShareSVG} from "../../../theme/svgs/shareSVG";
import {DownloadSVG} from "../../../theme/svgs/downloadSVG";

import {TrashSVG} from "../../../theme/svgs/trashSVG";

class SearchResultsPanelView extends Component<SearchResultsPanelViewProps> {
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
            pageWidth,
            onDownload,
            onCopy,
            onEdit,
            onShare,
            onDelete,
            permissions
        } = this.props;

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

        let author_text = selectedDocument?.author || "";
        if (selectedDocument) {
            if (selectedDocument.object_type !== ObjectType.DocumentInfo) {
                if (userLookup) {
                    const author_user = userLookup[selectedDocument.author || ""];

                    if (author_user) {
                        author_text = author_user.first_name + " " + author_user.last_name;
                    }
                }
            }
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
                <div className={'flex-fill search-results-panel d-flex flex-column align-items-center justify-content-center pt-4 pl-4 v-gap-5 position-relative w-100'}>
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
                        <div className={`search-results h-100 w-100 ${!selectedDocument ? "pb-4" : ""}`}>
                            {
                                ResultRenderer &&
                                <ResultRenderer searchResults={searchResults} onDocumentSelected={onDocumentSelected}
                                                userLookup={userLookup} pageWidth={pageWidth}/>
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
                    {
                        selectedDocument &&
                        <div className={"banner bg-selected d-flex justify-content-between w-100 mt-0 py-2 px-4 h-gap-3"}>
                            <div className={"d-flex h-gap-2 align-items-center overflow-hidden text-primary"}>
                                <div className={"text text-break overflow-hidden text-nowrap font-weight-semi-bold display-4"}>{selectedDocument.title}</div>
                                <div className={"text text-break overflow-hidden text-nowrap font-weight-light display-4"}>{author_text}</div>
                            </div>
                            <div className={"d-flex h-gap-2 align-items-center"}>
                                {
                                    permissions.canDownload &&
                                    <Button className={"bg-transparent"} tooltip={"Download"} onClick={() => onDownload(selectedDocument.id, selectedDocument.object_type)}>
                                        <DownloadSVG className={"small-image-container"}/>
                                    </Button>
                                }
                                {/*<Button className={"bg-transparent"} tooltip={"Copy"} onClick={() => onCopy(selectedDocument.id, selectedDocument.object_type)}>*/}
                                {/*    <CopyPocketSVG className={"small-image-container"}/>*/}
                                {/*</Button>*/}
                                {/*{*/}
                                {/*    permissions.canModify &&*/}
                                {/*    <Button className={"bg-transparent"} tooltip={"Edit"} onClick={() => onEdit(selectedDocument.id, selectedDocument.object_type)}>*/}
                                {/*        <EditSVG className={"small-image-container"}/>*/}
                                {/*    </Button>*/}
                                {/*}*/}
                                {/*<Button className={"bg-transparent"} tooltip={"Share"} onClick={() => onShare(selectedDocument.id, selectedDocument.object_type)}>*/}
                                {/*    <ShareSVG className={"small-image-container"}/>*/}
                                {/*</Button>*/}
                                {
                                    permissions.canDelete &&
                                    <Button className={"bg-transparent"} tooltip={"Delete"} onClick={() => onDelete(selectedDocument.id, selectedDocument.object_type)}>
                                        <TrashSVG className={"small-image-container"}/>
                                    </Button>
                                }
                            </div>
                        </div>
                    }
                </div>
            </div>
        );
    }
}

export default SearchResultsPanelView;
