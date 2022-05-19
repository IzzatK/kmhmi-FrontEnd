import React, {Component} from 'react';
import '../searchGraphsPanel.css';
import ScrollBar from "../../../theme/widgets/scrollBar/scrollBar";
import {XYChart} from "../../../theme/widgets/amcharts/xyChart/xyChart";
import {WordCloud} from "../../../theme/widgets/amcharts/wordCloud/wordCloud";
import {CirclePieChart} from "../../../theme/widgets/amcharts/circlePieChart/circlePieChart";
import {DonutPieChart} from "../../../theme/widgets/amcharts/donutPieChart/donutPieChart";
import {VariableRadiusDonutPieChart} from "../../../theme/widgets/amcharts/variableRadiusDonutPieChart/variableRadiusDonutPieChart";
import {SearchGraphsPanelViewProps} from "../searchGraphsModel";

export class SearchGraphsPanelView extends Component<SearchGraphsPanelViewProps> {
    constructor(props: any, context: any) {
        super(props, context);
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
            isAlternate,
            onSearchParamChanged,
            onToggleAlternate,
            isLoading,
            hasError,
            errorMessage
        } = this.props;

        let cn = 'search-graphs-panel d-flex flex-column py-3 px-4';

        if (className) {
            cn += ` ${className}`;
        }

        return (
            (isExpanded && !isLoading && !hasError && !errorMessage) &&
            <div className={cn}>
                {/*<Button className={'toggle-view-btn'} onClick={onToggleAlternate}>Toggle Alternate View</Button>*/}
                <ScrollBar className={`graphs-grid-container ${!isExpanded ? '' : 'expanded'}`} renderTrackVertical={isExpanded} renderTrackHorizontal={!isExpanded}>
                    {
                        isAlternate &&
                        <div className={`d-grid`}>
                            <CirclePieChart
                                className={'span-2'}
                                data={departmentData}
                                divName={'docsByDeptDiv'}
                                name={"Documents by Department"}
                                color={'var(--variable-radius-pie-chart-header-background)'}
                                minimized={!isExpanded}
                                onSelect={(id: string) => onSearchParamChanged('department', id)}
                            />
                            <VariableRadiusDonutPieChart
                                className={'span-2'}
                                data={purposeData}
                                divName={'docsByPurposeDiv'}
                                name={"Documents by Purpose"}
                                color={'var(--draggable-pie-chart-header-background)'}
                                minimized={!isExpanded}
                                onSelect={(id: string) => onSearchParamChanged('purpose', id)}
                            />
                            <XYChart
                                className={''}
                                data={totalUploadsData}
                                divName={'totalUploadsDiv'}
                                name={'KP Uploads'}
                                color={'var(--xy-chart-header-background)'}
                                minimized={!isExpanded}
                            />
                            <WordCloud
                                className={'span-3'}
                                data={customTagsData}
                                divName={'commonTagsDiv'}
                                name={'Common Tags on Documents'}
                                color={'var(--word-cloud-header-background)'}
                                minimized={!isExpanded}
                                onSelect={(id: string) => onSearchParamChanged('tags', id)}
                            />
                            <DonutPieChart
                                className={'span-2'}
                                data={docTypeData}
                                divName={'docTypeDiv'}
                                name={"Document Type"}
                                color={'var(--donut-pie-chart-header-background)'}
                                minimized={!isExpanded}
                            />
                        </div>
                    }
                    {
                        !isAlternate &&
                        <div className={`d-grid`}>
                            <CirclePieChart
                                className={'span-2'}
                                data={departmentData}
                                divName={'docsByDeptDiv'}
                                name={"Documents by Department"}
                                color={'var(--variable-radius-pie-chart-header-background)'}
                                minimized={!isExpanded}
                                onSelect={(id: string) => onSearchParamChanged('department', id)}
                            />
                            <CirclePieChart
                                className={'span-2'}
                                data={purposeData}
                                divName={'docsByPurposeDiv'}
                                name={"Documents by Purpose"}
                                color={'var(--draggable-pie-chart-header-background)'}
                                minimized={!isExpanded}
                                onSelect={(id: string) => onSearchParamChanged('purpose', id)}
                            />
                            <XYChart
                                className={''}
                                data={totalUploadsData}
                                divName={'recentUploadsDiv'}
                                name={'Recent KP Uploads'}
                                color={'var(--xy-chart-header-background)'}
                                minimized={!isExpanded}
                            />
                            <WordCloud
                                className={'span-3'}
                                data={customTagsData}
                                divName={'commonTagsDiv'}
                                name={'Common Tags on Documents'}
                                color={'var(--word-cloud-header-background)'}
                                minimized={!isExpanded}
                                onSelect={(id: string) => onSearchParamChanged('tags', id)}
                            />
                            <CirclePieChart
                                className={'span-2'}
                                data={docTypeData}
                                divName={'docTypeDiv'}
                                name={"Document Type"}
                                color={'var(--donut-pie-chart-header-background)'}
                                minimized={!isExpanded}
                            />
                            {/*<ListChart*/}
                            {/*    className={'span-2'}*/}
                            {/*    data={["Example Search 1", "Example Search 2", "Example Search 3"]}*/}
                            {/*    name={"Recent Searches"}*/}
                            {/*    color={'var(--draggable-pie-chart-header-background)'}*/}
                            {/*    minimized={!isExpanded}*/}
                            {/*/>*/}
                            {/*<StackedBarChart*/}
                            {/*    className={'span-3'}*/}
                            {/*    data={this.mockData}*/}
                            {/*    divName={'totalUploadsDiv'}*/}
                            {/*    name={"KP Uploads"}*/}
                            {/*    color={'var(--variable-radius-pie-chart-header-background)'}*/}
                            {/*    minimized={!isExpanded}*/}
                            {/*/>*/}
                        </div>
                    }
                </ScrollBar>
            </div>
        );
    }
}
