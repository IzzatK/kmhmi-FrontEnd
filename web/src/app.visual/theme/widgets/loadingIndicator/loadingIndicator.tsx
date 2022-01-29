import React, {Component} from 'react';
import './loadingIndicator.css';
import {LoadingIndicatorProps, LoadingIndicatorState} from "./loadingIndicatorModel";


export class LoadingIndicator extends Component<LoadingIndicatorProps, LoadingIndicatorState> {
    render () {
        const { className, size="medium", ...rest } = this.props;

        let cn = 'loader-container w-100 h-100 d-flex align-items-center justify-content-center'
        if (className) {
            cn += ` ${className}`;
        }
        if (size) {
            cn += ` ${size}`;
        }

        return (
            <div className={cn}>
                <div className={"loader"}/>
            </div>
        );
    }
}
