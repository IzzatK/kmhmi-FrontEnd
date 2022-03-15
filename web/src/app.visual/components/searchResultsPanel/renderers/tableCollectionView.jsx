import React, {Component} from 'react';
import GridTable from '@nadavshaar/react-grid-table';
import '../searchResultsPanel.css'
import CheckBox from "../../../theme/widgets/checkBox/checkBox";
import Button from "../../../theme/widgets/button/button";
import {ArrowRightSVG} from "../../../theme/svgs/arrowRightSVG";
import {ArrowLeftSVG} from "../../../theme/svgs/arrowLeftSVG";
import {LoadingIndicator} from "../../../theme/widgets/loadingIndicator/loadingIndicator";
import {TooltipPortal} from "../../../theme/widgets/tooltipPortal/tooltipPortal";
import {bindInstanceMethods} from "../../../../framework.core/extras/utils/typeUtils";
import Tag from "../../../theme/widgets/tag/tag";
import {EllipsisSVG} from "../../../theme/svgs/ellipsisSVG";
import {forEachKVP} from "../../../../framework.core/extras/utils/collectionUtils";

class TableCollectionView extends Component {
    resizeObserver;
    characterWidth;
    tagCharactersAllowed;
    tagCharactersDisplayed;
    nextTagWidth;

    constructor(props) {
        super(props);

        bindInstanceMethods(this);

        this.state = {
            columns: [],
            renderTrigger: 0,
        }

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

                    if (pageWidth === "FULL") {
                        this.tagCharactersAllowed = (width * 0.14) / this.characterWidth;
                    } else if (pageWidth === "ONE_HALF") {
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

    _onRowClick({ rowIndex, data, column, isEdit, event }, tableManager) {

        const { onDocumentSelected } = this.props;

        if (onDocumentSelected && data) {
            onDocumentSelected(data.id);
        }

    };

    componentDidMount() {
        const { pageWidth } = this.props;

        this._updateColumns(pageWidth);

        let element = document.getElementById("grid-table");
        if (element) {
            this.resizeObserver.observe(element);
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { pageWidth } = this.props;

        if (pageWidth !== prevProps.pageWidth) {
            this._updateColumns(pageWidth);
        }

        let element = document.getElementById("grid-table");
        if (element) {
            this.resizeObserver.observe(element);
        }
    }

    componentWillUnmount() {
        this.resizeObserver.disconnect();
    }

    _updateColumns(pageWidth) {
        if (pageWidth === 'FULL') {
            this.setState({
                ...this.state,
                columns: [
                    {
                        id: 1,
                        field: 'selected',
                        label: '',
                        width: '3.13%',
                        sortable: false,
                        resizable: false,
                        cellRenderer: this.CheckBoxCellRenderer,
                        headerCellRenderer: this.CheckBoxHeaderCellRenderer,
                    },
                    {
                        id: 2,
                        field: 'title',
                        label: 'Title',
                        width: '12.93%',
                        sortable: false,
                        resizable: false,
                        cellRenderer: this.TitleCellRender
                    },
                    {
                        id: 3,
                        field: 'timestamp',
                        label: 'Date',
                        width: '6.13%',
                        sortable: false,
                        resizable: false,
                        cellRenderer: this.DateCellRender
                    },
                    {
                        id: 4,
                        field: 'page_count',
                        label: 'Pg. Count',
                        width: '5.43%',
                        sortable: false,
                        resizable: false,
                        cellRenderer: this.PageCountCellRender
                    },
                    {
                        id: 5,
                        field: 'author',
                        label: 'Author',
                        width: '26.07%',
                        sortable: false,
                        resizable: false,
                        cellRenderer: this.AuthorCellRender
                    },
                    {
                        id: 6,
                        field: 'department',
                        label: 'Dept',
                        width: '6.74%',
                        sortable: false,
                        resizable: false,
                        cellRenderer: this.CellRenderer
                    },
                    {
                        id: 7,
                        field: 'project',
                        label: 'Project',
                        width: '7.08%',
                        sortable: false,
                        resizable: false,
                        cellRenderer: this.CellRenderer
                    },
                    {
                        id: 8,
                        field: 'public_tag',
                        label: 'Public Tags',
                        width: '16.23%',
                        sortable: false,
                        resizable: false,
                        cellRenderer: this.PublicTagCellRender
                    },
                    {
                        id: 9,
                        field: 'private_tag',
                        label: 'Private Tags',
                        width: '16.23%',
                        sortable: false,
                        resizable: false,
                        cellRenderer: this.PrivateTagCellRender
                    },
                ],
            });
        } else if (pageWidth === 'ONE_HALF') {
            this.setState({
                ...this.state,
                columns: [
                    {
                        id: 0,
                        field: 'selected',
                        label: '',
                        width: '4.91%',
                        sortable: false,
                        resizable: false,
                        cellRenderer: this.CheckBoxCellRenderer,
                        headerCellRenderer: this.CheckBoxHeaderCellRenderer,
                    },
                    {
                        id: 1,
                        field: 'title',
                        label: 'Title',
                        width: '20.32%',
                        sortable: false,
                        resizable: false,
                        cellRenderer: this.TitleCellRender
                    },
                    {
                        id: 2,
                        field: 'timestamp',
                        label: 'Date',
                        width: '9.79%',
                        sortable: false,
                        resizable: false,
                        cellRenderer: this.DateCellRender
                    },
                    {
                        id: 3,
                        field: 'page_count',
                        label: 'Pg. Count',
                        width: '7.73%',
                        sortable: false,
                        resizable: false,
                        cellRenderer: this.PageCountCellRender
                    },
                    {
                        id: 4,
                        field: 'author',
                        label: 'Author',
                        width: '35.23%',
                        sortable: false,
                        resizable: false,
                        cellRenderer: this.AuthorCellRender
                    },
                    {
                        id: 5,
                        field: 'public_tag',
                        label: 'Public Tags',
                        width: '22.01%',
                        sortable: false,
                        resizable: false,
                        cellRenderer: this.PublicTagCellRender
                    },
                ],
            });
        } else {
            this.setState({
                ...this.state,
                columns: [
                    {
                        id: 0,
                        field: 'selected',
                        label: '',
                        width: '11.58%',
                        sortable: false,
                        resizable: false,
                        cellRenderer: this.CheckBoxCellRenderer,
                        headerCellRenderer: this.CheckBoxHeaderCellRenderer,
                    },
                    {
                        id: 1,
                        field: 'title',
                        label: 'Title',
                        width: '36.35%',
                        sortable: false,
                        resizable: false,
                        cellRenderer: this.TitleCellRender
                    },
                    {
                        id: 2,
                        field: 'page_count',
                        label: 'Pg. Count',
                        width: '18.24%',
                        sortable: false,
                        resizable: false,
                        cellRenderer: this.PageCountCellRender
                    },
                    {
                        id: 3,
                        field: 'author',
                        label: 'Author',
                        width: '33.82%',
                        sortable: false,
                        resizable: false,
                        cellRenderer: this.AuthorCellRender
                    },

                ],
            });
        }
    }

    CellRenderer = ({ tableManager, value, field, data, column, colIndex, rowIndex }) => {

        const { selected } = data;

        let cn = 'rgt-cell-inner cursor-pointer d-flex align-items-center';

        if (selected) {
            cn += ` selected`;
        }

        return (
            <div className={cn}>
                <div className={"cell-text text-nowrap overflow-hidden header-2"}>{value}</div>
            </div>
        )
    }

    PageCountCellRender = ({ tableManager, value, field, data, column, colIndex, rowIndex }) => {

        const { selected } = data;

        let cn = 'rgt-cell-inner cursor-pointer d-flex align-items-center';

        if (selected) {
            cn += ` selected`;
        }

        return (
            <div className={cn}>
                <div className={"cell-text text-nowrap overflow-hidden header-2"}>{value ? "Pgs. " + value : ""}</div>
            </div>
        )
    }

    DateCellRender = ({ tableManager, value, field, data, column, colIndex, rowIndex }) => {

        const { selected } = data;

        let cn = 'rgt-cell-inner cursor-pointer d-flex align-items-center';

        if (selected) {
            cn += ` selected`;
        }

        return (
            <div className={cn}>
                <div className={"cell-text text-nowrap overflow-hidden header-2"}>{value.split(",")[0]}</div>
            </div>
        )
    }

    TitleCellRender = ({ tableManager, value, field, data, column, colIndex, rowIndex }) => {

        const { selected } = data;

        let cn = 'rgt-cell-inner cursor-pointer d-flex align-items-center overflow-hidden';

        if (selected) {
            cn += ` selected`;
        }

        return (
            <div className={cn}>
                <TooltipPortal portalContent={
                    <div>{value}</div>
                }>
                    <div className={"cell-text text-break overflow-hidden display-3 title"}>{value}</div>
                </TooltipPortal>
            </div>
        )
    }

    AuthorCellRender = ({ tableManager, value, field, data, column, colIndex, rowIndex }) => {

        const { selected } = data;

        let cn = 'rgt-cell-inner cursor-pointer d-flex align-items-center';

        if (selected) {
            cn += ` selected`;
        }

        return (
            <div className={cn}>
                <TooltipPortal portalContent={
                    <div>
                        {
                            value &&
                            <div>{value}</div>
                        }
                    </div>
                }>
                    <div className={"cell-text text-break overflow-hidden header-2 author"}>{value}</div>
                </TooltipPortal>
            </div>
        )
    }

    PublicTagCellRender = ({ tableManager, value, field, data, column, colIndex, rowIndex }) => {
        const { selected, public_tag } = data;

        let cn = 'rgt-cell-inner';

        if (selected) {
            cn += ` selected`;
        }

        let publicTagDivs = [];
        let displayPublicTagDivs = [];

        let length = 0;
        let totalLength = 0;

        let nextTagRecorded = false;

        this.tagCharactersDisplayed = 0;
        this.nextTagWidth = 0;

        if (public_tag) {
            forEachKVP(public_tag, (tag) => {
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

                    publicTagDivs?.push(<Tag name={tag} text={tag} isEdit={false} isGlobal={true} key={tag}/>)
                }
            })
        }

        return (
            <div className={cn}>
                <TooltipPortal portalContent={
                    <div className={"cursor-pointer d-inline-flex flex-wrap align-items-center overflow-auto"}>
                        {publicTagDivs}
                    </div>

                }>
                    <div className={"cursor-pointer d-flex align-items-center h-gap-2"}>
                        {displayPublicTagDivs}
                        {
                            (length < totalLength) &&
                            <EllipsisSVG className={"ml-5 small-image-container"}/>
                        }
                    </div>
                </TooltipPortal>
            </div>
        )
    }

    PrivateTagCellRender = ({ tableManager, value, field, data, column, colIndex, rowIndex }) => {

        const { selected, private_tag } = data;

        let cn = 'rgt-cell-inner';

        if (selected) {
            cn += ` selected`;
        }

        let privateTagDivs = [];
        let displayPrivateTagDivs = [];

        let length = 0;
        let totalLength = 0;

        let nextTagRecorded = false;

        this.tagCharactersDisplayed = 0;
        this.nextTagWidth = 0;

        if (private_tag) {
            forEachKVP(private_tag, (tag) => {
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

                    privateTagDivs?.push(<Tag name={tag} text={tag} isEdit={false} key={tag}/>)
                }
            })
        }

        return (
            <div className={cn}>
                <TooltipPortal portalContent={
                    <div className={"cursor-pointer d-inline-flex flex-wrap align-items-center overflow-auto"}>
                        {privateTagDivs}
                    </div>

                }>
                    <div className={"cursor-pointer d-flex align-items-center h-gap-2 overflow-hidden"}>
                        {displayPrivateTagDivs}
                        {
                            length > 2 &&
                            <EllipsisSVG className={"ml-5 small-image-container"}/>
                        }
                    </div>
                </TooltipPortal>
            </div>
        )
    }

    CheckBoxCellRenderer = ({ tableManager, value, field, data, column, colIndex, rowIndex }) => {

        const { selected, isUpdating=false } = data;

        let cn = 'rgt-cell-inner cursor-pointer d-flex align-items-center';

        if (selected) {
            cn += ` selected`;
        }

        return (
            isUpdating ?
                <div className={'rgt-cell-inner d-flex align-items-center position-relative'}>
                    <div className={"position-absolute"} style={{top: '0', right: '0', bottom: '0', left:'0'}}>
                        <LoadingIndicator/>
                    </div>
                </div>
                :
                <div className={cn}>
                    <CheckBox selected={selected} disabled={true}/>
                </div>
        )
    }

    CheckBoxHeaderCellRenderer = ({ tableManager, column }) => {

        let cn = 'd-flex align-items-center';

        return (
            <div className={cn}>
                <CheckBox/>
            </div>
        )
    }

    render() {
        const { searchResults, onDocumentSelected, pageWidth, ...rest } = this.props;

        return (
            <div className={'table h-100 w-100 position-relative'}>
                <GridTable showSearch={false}
                           className={'position-absolute h-100'}
                           onRowClick={this._onRowClick}
                           isPaginated={false}
                           enableColumnsReorder={false}
                           columns={this.state.columns}
                           onColumnsChange={columns => undefined}//this is a very important function that makes everything work
                           rows={searchResults}
                           showColumnVisibilityManager={false}
                           showRowsInformation={false}
                           id={"grid-table"}
                           components={{PageSize, Pagination}}
                />
            </div>
        );
    }
}

const PageSize = ({ tableManager }) => {
    return (
        <div/>
    )
}

const Pagination = ({ tableManager, page = tableManager.paginationApi.page,
                        onChange = tableManager.paginationApi.setPage, }) => {
    const {
        config: {
            additionalProps: { pagination: additionalProps = {} },
        },
        paginationApi: { totalPages },
    } = tableManager;

    return (
        <div {...additionalProps} className={'d-flex flex-row'}>
            <Button
                className={'arrow-button'}
                disabled={page - 1 < 1}
                onClick={() => onChange(page - 1)}
                orientation={'horizontal'} selected={false} text={''}
            >
                <ArrowLeftSVG className={"nano-image-container"}/>
            </Button>

            <div className="d-flex flex-row text-accent h-gap-2 pagination justify-content-center pt-1">
                {
                    (page - 3 > 0 && totalPages === page || page - 3 > 0) &&
                        <div onClick={() => onChange(1)}>...</div>
                }
                {
                    totalPages === page && page - 2 > 0 &&
                    <div onClick={() => onChange(page - 2)}>{page - 2}</div>
                }
                {
                    page - 1 > 0 &&
                    <div onClick={() => onChange(page - 1)}>{page - 1}</div>
                }
                <div className={'selected-page'}>{page}</div>
                {
                    totalPages > page &&
                    <div onClick={() => onChange(page + 1)}>{page + 1}</div>
                }
                {
                    page - 1 === 0 && totalPages > page + 1 &&
                    <div onClick={() => onChange(page + 2)}>{page + 2}</div>
                }
                {
                    (page - 1 === 0 && totalPages > page + 2 || totalPages > page + 2) &&
                    <div onClick={() => onChange(totalPages)}>...</div>
                }
            </div>

            <Button
                className={'arrow-button'}
                disabled={page + 1 > totalPages}
                onClick={() => onChange(page + 1)}
                orientation={'horizontal'} selected={false} text={''}>
                <ArrowRightSVG className={"nano-image-container"}/>
            </Button>
        </div>
    );
}

export default TableCollectionView;
