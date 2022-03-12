import React from 'react';
import './searchAdvancedPanel.css';
import TextInput from "../../theme/widgets/textEdit/textInput";
import ComboBox from "../../theme/widgets/comboBox/comboBox";
import Button from "../../theme/widgets/button/button";
import {RemoveSVG} from "../../theme/svgs/removeSVG";
import {CSSTransition, TransitionGroup} from "react-transition-group";
import {getClassNames} from "../../../framework.visual/extras/utils/animationUtils";
import ScrollBar from "../../theme/widgets/scrollBar/scrollBar";
import {ParamType} from "../../../model";
import {bindInstanceMethods} from "../../../framework/extras/typeUtils";

class SearchAdvancedPanelView extends React.Component {

    constructor(props, context) {
        super(props, context);

        bindInstanceMethods(this);
    }


    _onTextChanged(id, value) {
        const { onSearchParamChanged } = this.props;

        if (onSearchParamChanged) {
            onSearchParamChanged(id, value);
        }
    }

    _onNumberChanged(id, value) {
        const { onSearchParamChanged } = this.props;

        if (onSearchParamChanged) {
            onSearchParamChanged(id, value);
        }
    }

    _onDateChanged(state, id, propertyId, propertyValue) {
        const { onSearchParamChanged } = this.props;

        let nextValue = {
            ...state,
            [propertyId]: propertyValue
        }

        if (onSearchParamChanged) {
            onSearchParamChanged(id, nextValue);
        }
    }

    _onTypeChanged(id, value) {
        const { onSearchParamChanged } = this.props;

        if (onSearchParamChanged) {
            onSearchParamChanged(id, value);
        }
    }

    _onCriterionAdded(id) {
        const { onCriterionAdded } = this.props;

        if (onCriterionAdded) {
            onCriterionAdded(id);
        }
    }

    _onCriterionRemoved(id) {
        const { onCriterionRemoved } = this.props;

        if (onCriterionRemoved) {
            onCriterionRemoved(id);
        }
    }

    render() {
        const {
            className, onPropertyChanged, sendEvent,
            searchParams, searchParamTypes, onCriterionRemoved, onCriterionAdded, onSearchParamChanged,
            ...rest
        } = this.props;

        // should know how to render different search types

        let divs = searchParams.map(item => {
            const {id, type, title='', value, options= null} = item;

            let cellRenderer = null;

            switch (type) {
                case ParamType.STRING: {
                    cellRenderer = (
                        <TextInput id={id} value={value} onChange={value => this._onTextChanged(id, value)}/>
                    )
                    break;
                }
                case ParamType.NUMBER: {
                    cellRenderer = (
                        <TextInput value={value} onChange={value => this._onTextChanged(id, value)}/>
                    )
                    break;
                }
                case ParamType.DATE_RANGE: {
                    const { start_date, end_date } = value || {};
                    cellRenderer = (
                        <div className={'d-flex h-gap-4'}>
                            <div className={'d-flex h-gap-2 align-items-center'}>
                                <div className={'search-text header-3'}>Start Date</div>
                                <input type={'date'} value={start_date} onChange={event => this._onDateChanged(value, id, 'start_date', event.target.value)}/>
                            </div>
                            <div className={'d-flex h-gap-2 align-items-center'}>
                                <div className={'search-text header-3'}>End Date</div>
                                <input type={'date'} value={end_date} onChange={event => this._onDateChanged(value, id, 'end_date', event.target.value)}/>
                            </div>
                        </div>
                    )
                    break;
                }
                case ParamType.OPTIONS: {
                    let cbTitle = title;
                    if (options && options[value]) {
                        cbTitle = options[value].title;
                    }
                    else {
                        cbTitle = 'Select ' + title;
                    }

                    cellRenderer = (
                        <ComboBox title={cbTitle} items={options} onSelect={(value) => this._onTypeChanged(id, value)}/>
                    )
                    break;
                }
                default: {
                    cellRenderer = (
                        <div>NO RENDERER</div>
                    )
                    break;
                }
            }

            let cn = "d-flex header-1 text-secondary justify-content-between p-2 align-items-stretch";
            if (searchParams.indexOf(item) % 2 === 0) {
                cn += ` even-row`;
            }

            return (
                <CSSTransition key={id} timeout={300} classNames={getClassNames('slideDownIn', 'slideDownIn', 'slideRightOut') }>
                    <div key={id} className={cn}>
                        <div className={'d-flex h-gap-5 align-items-stretch'}>
                            <div className={'d-flex align-items-center'}>
                                <div className={'header-3 font-weight-semi-bold text-secondary'} style={{minWidth: '15rem'}}>{title}</div>
                            </div>
                            {cellRenderer}
                        </div>
                        <Button className={'btn-transparent'} onClick={() => this._onCriterionRemoved(id)}>
                            <RemoveSVG className={"tiny-image-container"}/>
                        </Button>
                    </div>
                </CSSTransition>
            )

        })

        let cn = 'search-advanced-panel d-flex flex-column v-gap-3 px-4';

        if (className) {
            cn += ` ${className}`;
        }

        return (
            <div className={cn} {...rest}>
                <div className={'adding-row d-flex h-gap-3 align-items-center'}>
                    <ComboBox className={"search-combo-box"} title={'Add new Criteria'} items={searchParamTypes} onSelect={this._onCriterionAdded}/>
                </div>
                <div className={'flex-fill position-relative'}>
                    <div className={'search-container position-absolute h-100 w-100'}>
                        <ScrollBar renderTrackHorizontal={false}>
                            <ul className={'pr-3 h-100 w-100'}>
                                <TransitionGroup component={null}>
                                    {divs}
                                </TransitionGroup>
                            </ul>
                        </ScrollBar>
                    </div>

                </div>

            </div>
        );
    }
}

SearchAdvancedPanelView.propTypes = {

};

export default SearchAdvancedPanelView;
