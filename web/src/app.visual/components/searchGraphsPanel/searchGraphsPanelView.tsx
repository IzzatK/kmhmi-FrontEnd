import React, {Component} from 'react';
import './searchGraphsPanel.css';
import ScrollBar from "../../theme/widgets/scrollBar/scrollBar";
import {XYChart} from "../../theme/widgets/amcharts/xyChart/xyChart";
import {WordCloud} from "../../theme/widgets/amcharts/wordCloud/wordCloud";
import {CirclePieChart} from "../../theme/widgets/amcharts/circlePieChart/circlePieChart";
import {DonutPieChart} from "../../theme/widgets/amcharts/donutPieChart/donutPieChart";
import {VariableRadiusDonutPieChart} from "../../theme/widgets/amcharts/variableRadiusDonutPieChart/variableRadiusDonutPieChart";
import {SearchGraphsState, SearchGraphsProps} from "./searchGraphsModel";

export class SearchGraphsPanelView extends Component<SearchGraphsProps, SearchGraphsState> {

    constructor(props: any, context: any) {
        super(props, context);

        this.state = {
            isAlternate: true,
        }
    }

    componentDidMount() {

    }

    componentDidUpdate(prevProps: Readonly<SearchGraphsProps>, prevState: Readonly<SearchGraphsState>, snapshot?: any) {

    }

    toggleAlternate() {
        const { isAlternate } = this.state;
        this.setState({
            ...this.state,
            isAlternate: !isAlternate,
        })
    }

    private onSearchParamChanged(id: string, value: string) {
        const { onSearchParamChanged } = this.props;

        if (onSearchParamChanged) {
            onSearchParamChanged(id, value);
        }
    }

    render() {
        const {
            className, departmentData, purposeData, totalUploadsData, customTagsData, docTypeData, isExpanded,
        } = this.props;

        const { isAlternate } = this.state;

        let cn = 'search-graphs-panel d-flex flex-column py-3 px-4';

        if (className) {
            cn += ` ${className}`;
        }

        return (
            <div className={cn}>
                {/*<Button className={'toggle-view-btn'} onClick={() => this.toggleAlternate()}>Toggle Alternate View</Button>*/}
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
                                onSelect={(id: string) => this.onSearchParamChanged('department', id)}
                            />
                            <VariableRadiusDonutPieChart
                                className={'span-2'}
                                data={purposeData}
                                divName={'docsByPurposeDiv'}
                                name={"Documents by Purpose"}
                                color={'var(--draggable-pie-chart-header-background)'}
                                minimized={!isExpanded}
                                onSelect={(id: string) => this.onSearchParamChanged('purpose', id)}
                            />
                            <XYChart
                                className={''}
                                data={totalUploadsData}
                                divName={'totalUploadsDiv'}
                                name={'Total Uploads'}
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
                                onSelect={(id: string) => this.onSearchParamChanged('tags', id)}
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
                                className={''}
                                data={departmentData}
                                divName={"docsByDeptDiv"}
                                name={"Documents by Department"}
                                color={'var(--variable-radius-pie-chart-header-background)'}
                                minimized={!isExpanded}
                                onSelect={(id: string) => this.onSearchParamChanged('department', id)}
                            />
                            <CirclePieChart
                                className={''}
                                data={purposeData}
                                divName={"docsByPurposeDiv"}
                                name={"Documents by Purpose"}
                                color={'var(--draggable-pie-chart-header-background)'}
                                minimized={!isExpanded}
                                onSelect={(id: string) => this.onSearchParamChanged('purpose', id)}
                            />
                            <XYChart
                                className={''}
                                data={totalUploadsData}
                                divName={'totalUploadsDiv'}
                                name={'Total Uploads'}
                                color={'var(--xy-chart-header-background)'}
                                minimized={!isExpanded}
                            />
                            <WordCloud
                                className={''}
                                data={customTagsData}
                                divName={'commonTagsDiv'}
                                name={'Common Tags on Documents'}
                                color={'var(--word-cloud-header-background)'}
                                minimized={!isExpanded}
                                onSelect={(id: string) => this.onSearchParamChanged('tags', id)}
                            />
                            <CirclePieChart
                                className={''}
                                data={docTypeData}
                                divName={"docTypeDiv"}
                                name={"Document Type"}
                                color={'var(--donut-pie-chart-header-background)'}
                                minimized={!isExpanded}
                            />
                        </div>
                    }
                </ScrollBar>
            </div>
        );
    }
}
