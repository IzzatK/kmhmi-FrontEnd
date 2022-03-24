import React, {Component} from 'react';
import './statsPanel.css';
import '../../theme/stylesheets/panel.css';
import {StatsPanelProps, StatsPanelState} from "./statsPanelModel";

class StatsPanelView extends Component<StatsPanelProps, StatsPanelState> {
    constructor(props: any, context: any) {
        super(props, context);
    }

    render() {
        const { className } = this.props;

        let cn = "d-flex";

        if (className) {
            cn += ` ${className}`;
        }

        return (
            <div className={cn}>
                <div className={'stats-panel system-tool-panel flex-fill p-4 d-flex align-items-center justify-content-center'}>
                    <div className={'header-1 text-primary'}>Stats Panel</div>
                </div>
            </div>
        );
    }
}

export default StatsPanelView;
