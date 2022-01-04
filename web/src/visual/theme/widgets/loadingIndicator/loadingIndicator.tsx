import React, {Component} from 'react';
import './loadingIndicator.css';
import {LoadingIndicatorProps, LoadingIndicatorState} from "./loadingIndicatorModel";


export class LoadingIndicator extends Component<LoadingIndicatorProps, LoadingIndicatorState> {
    render () {
        const { className, ...rest } = this.props;

        let cn = 'loader-container position-absolute w-100 h-100 d-flex align-items-center justify-content-center'
        if (className) {
            cn += ` ${className}`;
        }

        return (
            <div className={cn}>
                <div className={"loader"}/>
            </div>
        );
    }
}
