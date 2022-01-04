import React, {Component} from 'react';
import GridTable from '@nadavshaar/react-grid-table';
import '../searchResultsPanel.css'
import CheckBox from "../../../theme/widgets/checkBox/checkBox";
import Button from "../../../theme/widgets/button/button";
import {ArrowRightSVG} from "../../../theme/svgs/arrowRightSVG";
import {ArrowLeftSVG} from "../../../theme/svgs/arrowLeftSVG";
import {LoadingIndicator} from "../../../theme/widgets/loadingIndicator/loadingIndicator";
import {TooltipPortal} from "../../../theme/widgets/tooltipPortal/tooltipPortal";
import {bindInstanceMethods} from "../../../../framework/extras/typeUtils";
import Tag from "../../../theme/widgets/tag/tag";

class TableCollectionView extends Component {
    constructor(props) {
        super(props);

        bindInstanceMethods(this);

        this.state = {
            columns: [],
        }
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
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { pageWidth } = this.props;

        if (pageWidth !== prevProps.pageWidth) {
            this._updateColumns(pageWidth);
        }
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
                        cellRenderer: CheckBoxCellRenderer,
                        headerCellRenderer: CheckBoxHeaderCellRenderer,
                    },
                    {
                        id: 2,
                        field: 'title',
                        label: 'Title',
                        width: '12.93%',
                        sortable: false,
                        resizable: false,
                        cellRenderer: TitleCellRender
                    },
                    {
                        id: 3,
                        field: 'timestamp',
                        label: 'Date',
                        width: '6.13%',
                        sortable: false,
                        resizable: false,
                        cellRenderer: DateCellRender
                    },
                    {
                        id: 4,
                        field: 'page_count',
                        label: 'Pg. Count',
                        width: '5.43%',
                        sortable: false,
                        resizable: false,
                        cellRenderer: PageCountCellRender
                    },
                    {
                        id: 5,
                        field: 'author',
                        label: 'Author',
                        width: '26.07%',
                        sortable: false,
                        resizable: false,
                        cellRenderer: AuthorCellRender
                    },
                    {
                        id: 6,
                        field: 'department',
                        label: 'Dept',
                        width: '6.74%',
                        sortable: false,
                        resizable: false,
                        cellRenderer: CellRenderer
                    },
                    {
                        id: 7,
                        field: 'project',
                        label: 'Project',
                        width: '7.08%',
                        sortable: false,
                        resizable: false,
                        cellRenderer: CellRenderer
                    },
                    {
                        id: 8,
                        field: 'public_tag',
                        label: 'Public Tags',
                        width: '16.23%',
                        sortable: false,
                        resizable: false,
                        cellRenderer: PublicTagCellRender
                    },
                    {
                        id: 9,
                        field: 'private_tag',
                        label: 'Private Tags',
                        width: '16.23%',
                        sortable: false,
                        resizable: false,
                        cellRenderer: PrivateTagCellRender
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
                        cellRenderer: CheckBoxCellRenderer,
                        headerCellRenderer: CheckBoxHeaderCellRenderer,
                    },
                    {
                        id: 1,
                        field: 'title',
                        label: 'Title',
                        width: '20.32%',
                        sortable: false,
                        resizable: false,
                        cellRenderer: TitleCellRender
                    },
                    {
                        id: 2,
                        field: 'timestamp',
                        label: 'Date',
                        width: '9.79%',
                        sortable: false,
                        resizable: false,
                        cellRenderer: DateCellRender
                    },
                    {
                        id: 3,
                        field: 'page_count',
                        label: 'Pg. Count',
                        width: '7.73%',
                        sortable: false,
                        resizable: false,
                        cellRenderer: PageCountCellRender
                    },
                    {
                        id: 4,
                        field: 'author',
                        label: 'Author',
                        width: '35.23%',
                        sortable: false,
                        resizable: false,
                        cellRenderer: AuthorCellRender
                    },
                    {
                        id: 5,
                        field: 'public_tag',
                        label: 'Public Tags',
                        width: '22.01%',
                        sortable: false,
                        resizable: false,
                        cellRenderer: PublicTagCellRender
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
                        cellRenderer: CheckBoxCellRenderer,
                        headerCellRenderer: CheckBoxHeaderCellRenderer,
                    },
                    {
                        id: 1,
                        field: 'title',
                        label: 'Title',
                        width: '36.35%',
                        sortable: false,
                        resizable: false,
                        cellRenderer: TitleCellRender
                    },
                    {
                        id: 2,
                        field: 'page_count',
                        label: 'Pg. Count',
                        width: '18.24%',
                        sortable: false,
                        resizable: false,
                        cellRenderer: PageCountCellRender
                    },
                    {
                        id: 3,
                        field: 'author',
                        label: 'Author',
                        width: '33.82%',
                        sortable: false,
                        resizable: false,
                        cellRenderer: AuthorCellRender
                    },

                ],
            });
        }
    }

    render() {
        const { searchResults, onDocumentSelected, pageWidth, ...rest } = this.props;

        return (
            <div className={'table h-100 w-100 position-relative'}>
                <GridTable showSearch={false} className={'position-absolute h-100'}
                           onRowClick={this._onRowClick} isPaginated={false} enableColumnsReorder={false}
                           columns={this.state.columns}
                           onColumnsChange={columns => undefined}//this is a very important function that makes everything work
                           rows={searchResults} showColumnVisibilityManager={false} showRowsInformation={false}
                components={{PageSize, Pagination}}/>
            </div>
        );
    }
}

const CellRenderer = ({ tableManager, value, field, data, column, colIndex, rowIndex }) => {

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

const PageCountCellRender = ({ tableManager, value, field, data, column, colIndex, rowIndex }) => {

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

const DateCellRender = ({ tableManager, value, field, data, column, colIndex, rowIndex }) => {

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

const TitleCellRender = ({ tableManager, value, field, data, column, colIndex, rowIndex }) => {

    const { selected } = data;

    let cn = 'rgt-cell-inner cursor-pointer d-flex align-items-center';

    if (selected) {
        cn += ` selected`;
    }

    return (
        <div className={cn}>
            <TooltipPortal portalContent={
                <div className={'bg-primary shadow-lg header-4 text-wrap p-2 rounded border border-secondary'}>
                    {value}
                </div>
            }>
                <div className={"cell-text text-break overflow-hidden display-3 title"}>{value}</div>
            </TooltipPortal>
        </div>
    )
}

const AuthorCellRender = ({ tableManager, value, field, data, column, colIndex, rowIndex }) => {

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
                        <div className={'bg-primary shadow-lg header-4 text-wrap p-2 rounded border border-secondary'}>
                            {value}
                        </div>
                    }
                </div>
            }>
                <div className={"cell-text text-break overflow-hidden header-2 author"}>{value}</div>
            </TooltipPortal>
        </div>
    )
}

const PublicTagCellRender = ({ tableManager, value, field, data, column, colIndex, rowIndex }) => {

    const { selected } = data;

    let cn = 'rgt-cell-inner cursor-pointer d-flex align-items-center h-gap-2 overflow-hidden';

    if (selected) {
        cn += ` selected`;
    }

    return (
        <div className={cn}>
            {
                value && value.split(",").map(tag => {
                    return tag.length > 0 && <Tag name={tag} text={tag} isEdit={false} isGlobal={true}/>
                })
            }
        </div>
    )
}

const PrivateTagCellRender = ({ tableManager, value, field, data, column, colIndex, rowIndex }) => {

    const { selected } = data;

    let cn = 'rgt-cell-inner cursor-pointer d-flex align-items-center h-gap-2 overflow-hidden';

    if (selected) {
        cn += ` selected`;
    }

    return (
        <div className={cn}>
            {
                value && value.split(",").map(tag => {
                    return tag.length > 0 && <Tag name={tag} text={tag} isEdit={false}/>
                })
            }
        </div>
    )
}

const CheckBoxCellRenderer = ({ tableManager, value, field, data, column, colIndex, rowIndex }) => {

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

const CheckBoxHeaderCellRenderer = ({ tableManager, column }) => {

    let cn = 'd-flex align-items-center';

    return (
        <div className={cn}>
            <CheckBox/>
        </div>
    )
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
