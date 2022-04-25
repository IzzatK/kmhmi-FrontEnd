import React, {Component} from "react";
import {
    DocumentInfoVM, ObjectType,
    PageWidth,
    TableCollectionRendererProps,
    TableCollectionRendererState
} from "../../searchResultsModel";
import {bindInstanceMethods} from "../../../../../framework.core/extras/utils/typeUtils";
import {forEachKVP} from "../../../../../framework.core/extras/utils/collectionUtils";
import Tag from "../../../../theme/widgets/tag/tag";
import {ReportInfoSVG} from "../../../../theme/svgs/reportInfoSVG";
import {PocketInfoSVG} from "../../../../theme/svgs/pocketInfoSVG";
import {DocumentInfoSVG} from "../../../../theme/svgs/documentInfoSVG";
import ListItem from "../../../../theme/widgets/listItem/listItem";
import CheckBox from "../../../../theme/widgets/checkBox/checkBox";
import {TooltipPortal} from "../../../../theme/widgets/tooltipPortal/tooltipPortal";
import {EllipsisSVG} from "../../../../theme/svgs/ellipsisSVG";
import {LoadingIndicator} from "../../../../theme/widgets/loadingIndicator/loadingIndicator";
import ScrollBar from "../../../../theme/widgets/scrollBar/scrollBar";

class TableCollectionView extends Component<TableCollectionRendererProps, TableCollectionRendererState> {
    private resizeObserver: ResizeObserver;
    private readonly characterWidth: number;
    private tagCharactersAllowed: number;
    private tagCharactersDisplayed: number;
    private nextTagWidth: number;

    constructor(props: any) {
        super(props);

        this.state = {
            columnWidths: [],
            renderTrigger: 0,
        }

        bindInstanceMethods(this);

        this.characterWidth = 8.15;//pixels
        this.tagCharactersAllowed = 0;
        this.tagCharactersDisplayed = 0;
        this.nextTagWidth = 0;

        this.resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                if (entry.contentRect) {
                    const { renderTrigger } = this.state;
                    const { pageWidth } = this.props;

                    const width = entry.contentRect.width - 29;

                    if (pageWidth === PageWidth.FULL) {
                        this.tagCharactersAllowed = (width * 0.14) / this.characterWidth;
                    } else if (pageWidth === PageWidth.ONE_HALF) {
                        this.tagCharactersAllowed = (width * 0.17) / this.characterWidth;
                    }

                    if ((this.tagCharactersDisplayed > this.tagCharactersAllowed) || (this.tagCharactersDisplayed + this.nextTagWidth < this.tagCharactersAllowed)) {
                        this.setState({
                            ...this.state,
                            renderTrigger: renderTrigger + 1,
                        })
                    }
                }
            }
        })
    }

    componentDidMount() {
        const { pageWidth } = this.props;

        this._updateColumns(pageWidth);

        let element = document.getElementById("table-collection-view");
        if (element) {
            this.resizeObserver.observe(element);
        }
    }

    componentDidUpdate(prevProps: Readonly<TableCollectionRendererProps>, prevState: Readonly<TableCollectionRendererState>, snapshot?: any) {
    const { pageWidth } = this.props;

        if (pageWidth !== prevProps.pageWidth) {
            this._updateColumns(pageWidth);
        }

        let element = document.getElementById("table-collection-view");
        if (element) {
            this.resizeObserver.observe(element);
        }
    }

    componentWillUnmount() {
        this.resizeObserver.disconnect();
    }

    _updateColumns(pageWidth: PageWidth) {
        let nextColumnWidths: string[];
        switch (pageWidth) {
            case PageWidth.FULL:
                nextColumnWidths = [
                    '3.39%',
                    '14.05%',
                    '6.76%',
                    '5.90%',
                    '28.25%',
                    '7.32%',
                    '7.69%',
                    '7.26%',
                    '17.62%'
                ];
                break;
            case PageWidth.ONE_HALF:
                nextColumnWidths = [
                    '4.85%',
                    '20.05%',
                    '9.66%',
                    '7.63%',
                    '34.76%',
                    '0',
                    '0',
                    '0',
                    '21.71%'
                ];
                break;
            case PageWidth.ONE_THIRD:
            default:
                nextColumnWidths = [
                    '11.58%',
                    '36.35%',
                    '0',
                    '18.24%',
                    '33.82%',
                    '0',
                    '0',
                    '0',
                    '0'
                ];
                break;
        }

        this.setState({
            ...this.state,
            columnWidths: nextColumnWidths,
        })
    }

    render() {
        const { className, searchResults, onDocumentSelected, pageWidth, userLookup } = this.props;
        const { columnWidths } = this.state;

        let cn = "table h-100";
        if (className) {
            cn += ` ${className}`;
        }

        let itemDivs: any[] = [];
        if (searchResults) {
            itemDivs = searchResults.map((item: DocumentInfoVM) => {
                const {id, author, title, selected, publication_date, public_tag, private_tag,
                    department, purpose, project, page_count, isUpdating, object_type} = item;

                let cn = 'result-item d-flex align-items-center h-gap-1';
                if (selected) {
                    cn += ' selected shadow-lg'
                }

                let author_text = author;
                if (object_type !== ObjectType.DocumentInfo) {
                    if (userLookup) {
                        const author_user = userLookup[author || ""];

                        if (author_user) {
                            author_text = author_user.first_name + " " + author_user.last_name;
                        }
                    }
                }

                let hoverTagDivs: any[] = [];
                let displayPublicTagDivs: any[] = [];
                let displayPrivateTagDivs: any[] = [];

                let length = 0;
                let totalLength = 0;

                let nextTagRecorded = false;

                this.tagCharactersDisplayed = 0;
                this.nextTagWidth = 0;

                if (public_tag) {
                    forEachKVP(public_tag, (tag: string) => {
                        if (tag.length > 0) {
                            this.tagCharactersDisplayed += (tag.length + (46 / this.characterWidth));

                            if (this.tagCharactersDisplayed < this.tagCharactersAllowed) {
                                displayPublicTagDivs?.push(<Tag name={tag} text={tag} isEdit={false} isGlobal={true} key={tag + "_short"}
                                />);
                                length++;
                            } else if (!nextTagRecorded) {
                                this.nextTagWidth = tag.length;
                                nextTagRecorded = true;
                            }

                            totalLength++;

                            hoverTagDivs?.push(<Tag name={tag} text={tag} isEdit={false} isGlobal={true} key={tag}/>)
                        }
                    })
                }

                if (private_tag) {
                    forEachKVP(private_tag, (tag: string) => {
                        if (tag.length > 0) {
                            this.tagCharactersDisplayed += (tag.length + (46 / this.characterWidth));

                            if (this.tagCharactersDisplayed < this.tagCharactersAllowed) {
                                displayPrivateTagDivs?.push(<Tag name={tag} text={tag} isEdit={false} key={tag + "_short"}
                                />);
                                length++;
                            } else if (!nextTagRecorded) {
                                this.nextTagWidth = tag.length;
                                nextTagRecorded = true;
                            }

                            totalLength++;

                            hoverTagDivs?.push(<Tag name={tag} text={tag} isEdit={false} key={tag}/>)
                        }
                    })
                }

                let graphic_node;

                switch (object_type) {
                    case ObjectType.ReportInfo:
                        graphic_node = <ReportInfoSVG className={"medium-image-container"}/>
                        break;
                    case ObjectType.PocketInfo:
                        graphic_node = <PocketInfoSVG className={"medium-image-container"}/>
                        break;
                    case ObjectType.DocumentInfo:
                    default:
                        graphic_node = <DocumentInfoSVG className={"medium-image-container"}/>
                        break;
                }

                return (
                    <div key={id} className={"position-relative"} draggable={true}>
                        <ListItem selected={selected} className={cn} onClick={() => onDocumentSelected(id, object_type)}>
                            <div className={"d-flex align-items-center justify-content-center"} style={{width: columnWidths[0]}}>
                                <CheckBox className={'mt-1'} selected={selected} disabled={true}/>
                            </div>

                            <div className={'d-flex align-items-center overflow-hidden h-gap-3'} style={{width: columnWidths[1]}}>
                                {graphic_node}
                                <TooltipPortal portalContent={
                                    <div>{title}</div>
                                }>
                                    <div className={"text-break overflow-hidden display-3 title"}>{title}</div>
                                </TooltipPortal>
                            </div>

                            {
                                pageWidth !== PageWidth.ONE_THIRD &&
                                <div className={"d-flex align-items-center"} style={{width: columnWidths[2]}}>
                                    <div className={"text-nowrap overflow-hidden header-2"}>{publication_date}</div>
                                </div>
                            }

                            <div className={"d-flex align-items-center"} style={{width: columnWidths[3]}}>
                                <div className={"text-nowrap overflow-hidden header-2"}>{page_count ? "Pgs. " + page_count : ""}</div>
                            </div>

                            <div className={"d-flex align-items-center"} style={{width: columnWidths[4]}}>
                                <TooltipPortal portalContent={
                                    <div>
                                        {
                                            author &&
                                            <div>{author_text}</div>
                                        }
                                    </div>
                                }>
                                    <div className={"text-break overflow-hidden header-2 author"}>{author_text}</div>
                                </TooltipPortal>
                            </div>

                            {
                                pageWidth === PageWidth.FULL &&
                                <div className={"d-flex align-items-center"} style={{width: columnWidths[5]}}>
                                    <div className={"text-nowrap overflow-hidden header-2"}>{department}</div>
                                </div>
                            }

                            {
                                pageWidth === PageWidth.FULL &&
                                <div className={"d-flex align-items-center"} style={{width: columnWidths[6]}}>
                                    <div className={"text-nowrap overflow-hidden header-2"}>{project}</div>
                                </div>
                            }

                            {
                                pageWidth === PageWidth.FULL &&
                                <div className={"d-flex align-items-center"} style={{width: columnWidths[6]}}>
                                    <div className={"text-nowrap overflow-hidden header-2"}>{purpose}</div>
                                </div>
                            }

                            {
                                pageWidth !== PageWidth.ONE_THIRD &&
                                <div className={"d-flex"} style={{width: columnWidths[8]}}>
                                    <TooltipPortal portalContent={
                                        <div className={'d-flex justify-content-start align-items-center overflow-hidden'}>
                                            <div className={'d-inline-flex flex-wrap align-items-center'}>
                                                {hoverTagDivs}
                                            </div>
                                        </div>

                                    }>
                                        <div id={id} className={'d-flex justify-content-start align-items-center h-gap-2'}>
                                            {
                                                public_tag && Object.keys(public_tag).length > 0 &&
                                                <div className={'d-flex align-items-center h-gap-2'}>
                                                    {displayPublicTagDivs}
                                                </div>
                                            }
                                            {
                                                private_tag && Object.keys(private_tag).length > 0 &&
                                                <div className={'d-flex align-items-center h-gap-2'}>
                                                    {displayPrivateTagDivs}
                                                </div>
                                            }
                                            {
                                                (length < totalLength) &&
                                                <EllipsisSVG className={"ml-2 small-image-container"}/>
                                            }
                                        </div>
                                    </TooltipPortal>
                                </div>
                            }
                        </ListItem>
                        {
                            isUpdating &&
                            <div className={"loader position-absolute"}>
                                <LoadingIndicator/>
                            </div>
                        }
                    </div>
                )
            });
        }

        return (
            <div className={cn} id={"table-collection-view"}>
                <div className={"table-header d-flex h-gap-1"}>
                    <div className={"column-header d-flex align-items-center justify-content-center"} style={{width: columnWidths[0]}}>
                        <CheckBox disabled={true}/>
                    </div>

                    <div className={"column-header d-flex align-items-center justify-content-center display-3 text-center"} style={{width: columnWidths[1]}}>Title</div>

                    {
                        pageWidth !== PageWidth.ONE_THIRD &&
                        <div className={"column-header d-flex align-items-center justify-content-center display-3 text-center"} style={{width: columnWidths[2]}}>Date</div>
                    }

                    <div className={"column-header d-flex align-items-center justify-content-center display-3 text-center"} style={{width: columnWidths[3]}}>Pg. Count</div>

                    <div className={"column-header d-flex align-items-center justify-content-center display-3 text-center"} style={{width: columnWidths[4]}}>Author</div>

                    {
                        pageWidth === PageWidth.FULL &&
                        <div className={"column-header d-flex align-items-center justify-content-center display-3 text-center"} style={{width: columnWidths[5]}}>Dept</div>
                    }

                    {
                        pageWidth === PageWidth.FULL &&
                        <div className={"column-header d-flex align-items-center justify-content-center display-3 text-center"} style={{width: columnWidths[6]}}>Project</div>
                    }

                    {
                        pageWidth === PageWidth.FULL &&
                        <div className={"column-header d-flex align-items-center justify-content-center display-3 text-center"} style={{width: columnWidths[7]}}>Purpose</div>
                    }

                    {
                        pageWidth !== PageWidth.ONE_THIRD &&
                        <div className={"column-header d-flex align-items-center justify-content-center display-3 text-center"} style={{width: columnWidths[8]}}>Tags</div>
                    }
                </div>
                <ScrollBar renderTrackHorizontal={false} className={"p-0"}>
                    <div className={"table-body"}>
                        {itemDivs}
                    </div>
                </ScrollBar>
            </div>
        );
    }
}

export default TableCollectionView;
